const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require("mongoose");

const Post = require('../models/Post');
const Profile = require('../models/Profile');
const mockPosts = require('./__mocks__/posts');
const mockProfiles = require('./__mocks__/profiles');
const sinon = require('sinon');
const passport = require('passport');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Posts", () => {
  let db;

  before(done => {
    // this.authenticate = 
    //   sinon
    //     .stub(passport, 'authenticate')
    //     .returns(() => { user: {
    //         id: '5d497baeed8f0b4d00ece2cb'
    //       }
    //     });

    // sinon.stub(passport,"authenticate").callsFake((strategy, options, callback) => {            
    //   callback(null, { user: { id: '5d497baeed8f0b4d00ece2cb' } }, null);             
    //   return (req,res,next)=>{};
    // });
        

    db = mongoose.connect("mongodb://localhost:27017/test")
      .then(() => 
        mockPosts.forEach(function(post) {
          const newPost = new Post({
            _id: post._id,
            text: post.text,
            name: post.name,
            user: post.user,
            date: post.date,
            avatar: post.avatar,
            likes: post.likes,
            comments: post.comments
          });
          newPost.save();
        })
        // mockProfiles.forEach(function(profile) {
        //   const newProfile = new Profile({
        //     _id: profile._id,
        //     skills: profile.skills,
        //     date: profile.date,
        //     user: profile.user,
        //     handle: profile.handle,
        //     company: profile.company,
        //     website: profile.website,
        //     location: profile.location,
        //     status: profile.status,
        //     social: profile.social,
        //     // experience: profile.experience[0],
        //     // education: profile.education[0],
        //     bio: profile.bio
        //   });
        //   newProfile.save();
        // })
    )
    .then(() => done());
  });

  after(done => {
    Post
      .remove({})
      .then(() => mongoose.connection.close(done));
      // Profile
      //   .remove({})
  });

  // beforeEach(done => {
  //   User.remove({}, done);
  // });

  describe("Posts /", () => {

    // beforeEach(() => {
    //   const user = [
    //     {
    //       id: 1,
    //       username: 'michael',
    //       password: 'something'
    //     }
    //   ];
    //   this.query = sinon.stub(queries, 'addUser').resolves(user);
    //   this.authenticate.yields(null, { id: 1 });
    // });

    // Test to get all Posts record
    it("should GET all Posts record", (done) => {
        chai.request(app)
          .get('/api/posts')
          .end((err, res) => {
            res.should.have.status(200);
            // console.log(res.body.length);
            res.body.length.should.equal(2);
            res.body.should.be.a('array');
            done();
          });
      });

    // Test to get single Post record
    it("should GET a single Post record", (done) => {
        const id = mockPosts[0]._id;
        chai.request(app)
          .get(`/api/posts/${id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
          });
    });
    

    // Test to delete single Post record
    it("should DELETE a specific Post record", (done) => {  
      const id = mockPosts[1]._id;
      chai.request(app)
        .delete(`/api/posts/${id}`)
        .end((err, res) => {
          
          res.should.have.status(200);
          // res.body.should.be.a('object');
          done();
        });
    });

    it(`should return 401 when user tries to DELETE Post record but didn not create the post`, (done) => {  
      const id = mockPosts[0]._id;
      chai.request(app)
        .delete(`/api/posts/${id}`)
        .end((err, res) => {
          const expectedBody = { unauthorised: 'User not authorised!' };
          const actualBody = res.body;

          expectedBody.toString().should.equal(actualBody.toString());
          res.should.have.status(401);
          done();
        });
    });

    it(`should return 404 when user tries to DELETE non-existant Post record`, (done) => {  
      const id = mockPosts[0]._id.replace('9', '8');
      chai.request(app)
        .delete(`/api/posts/${id}`)
        .end((err, res) => {
          const expectedBody = { noPost: 'Post not found, no delete occurred!' };
          const actualBody = res.body;

          expectedBody.toString().should.equal(actualBody.toString());
          res.should.have.status(404);
          done();
        });
    });

    it(`should return 404 and 'Text field is required' json when trying to post new post, but post text is empty`, (done) => {  
      chai.request(app)
        .post(`/api/posts`)
        .send({})
        .end((err, res) => {
          // console.log(res.body);
          const expectedBody = { text: 'Text field is required' };
          const actualBody = res.body;

          expectedBody.toString().should.equal(actualBody.toString());
          res.should.have.status(404);
          done();
        });
    });

    it(`should return 404 and 'Post must be between 6 and 300 characters long.' json 
        when user tries to post new post, but post text is < 6 chars`, (done) => {  
        chai.request(app)
          .post(`/api/posts`)
          .send({ text: '12345' })
          .end((err, res) => {
            // console.log(res.body);
            const expectedBody = { text: 'Post must be between 6 and 300 characters long.' };
            const actualBody = res.body;

            expectedBody.toString().should.equal(actualBody.toString());
            res.should.have.status(404);
            done();
          });
    });

    // it(`should add new Post when req.body.text is be between 6 and 300 chars,
    //     and return 200 status code`, (done) => {  
    //     chai.request(app)
    //       .post(`/api/posts`)
    //       .send({ text: '12345678910' })
    //       .end((err, res) => {
    //         console.log(res.body);
    //         const expectedBody = { 
    //           text: '12345678910'
    //         };
    //         const actualBody = res.body;

    //         expectedBody.toString().should.equal(actualBody.toString());
    //         res.should.have.status(200);
    //         done();
    //       });
    // });


    // it(`should return 400 and 'likedAlready' json msg,
    //     when user tries to like post they've already liked`, (done) => {
    //     const id = mockPosts[0]._id;
    //     chai.request(app)
    //       .post(`/api/posts/like/${id}`)
    //       .end((err, res) => {
    //         // console.log(res.body);
    //         const expectedBody = { likedAlready: 'User has already liked post!' };
    //         const actualBody = res.body;

    //         expectedBody.toString().should.equal(actualBody.toString());
    //         res.should.have.status(400);
    //         done();
    //       });
    // });

    it(`should add a like to the post,
        and return 200 status code`, (done) => {
        const id = mockPosts[0]._id;
        chai.request(app)
          .post(`/api/posts/like/${id}`)
          .end((err, res) => {

            // compare likes count beforehand with likes count after request is complete            
            res.body.likes.length.should.equal(2);
            res.should.have.status(200);
            done();
          });
    });

    it(`should return 404 and postNotFound json 
        when trying to add a like to a non-existant post`, (done) => {
        const id = mockPosts[0]._id.replace('9', '8');
        chai.request(app)
          .post(`/api/posts/like/${id}`)
          .end((err, res) => {
            const expectedBody = { postNotFound: 'Could not find post with the id provided' };
            const actualBody = res.body;

            expectedBody.toString().should.equal(actualBody.toString());
            res.should.have.status(404);
            done();
          });
    });

    // next tests are the unlike route
    

  });
});