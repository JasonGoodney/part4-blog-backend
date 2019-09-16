const helper = require('./test_helper')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('blogs api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('of unique identifier property of the blog posts is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    blogsAtStart.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Valid Blog',
      author: 'Blog Validator',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api
      .post('/api/blogs')
      .set(
        'Authorization',
        'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhZERhZCIsImlkIjoiNWQ3ZTUzMWFhYTcwZGQzNzFlY2E0YWQ4IiwiaWF0IjoxNTY4NTU5OTI4fQ._AmNbydBJSF6RQ4KRA6sZkn4i1wuJtVs9KrWY6R535g'
      )
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Valid Blog')
  })

  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Bruce Greene'
    }

    await api
      .post('/api/blogs')
      .set(
        'Authorization',
        'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJhZERhZCIsImlkIjoiNWQ3ZTUzMWFhYTcwZGQzNzFlY2E0YWQ4IiwiaWF0IjoxNTY4NTU5OTI4fQ._AmNbydBJSF6RQ4KRA6sZkn4i1wuJtVs9KrWY6R535g'
      )
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
  })
})

describe('updating of a blog', () => {
  test('succeeds with status code 200 if valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 10 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toContainEqual(updatedBlog)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

    const urls = blogsAtEnd.map(blog => blog.url)
    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const blogs = []
    expect(helper.totalLikes(blogs)).toBe(0)
  })

  test('when list has only one blogs equals the likes of that', () => {
    const blogs = [
      {
        title: 'Twix',
        author: 'Lemon Cake',
        url: 'lemonycakies.com/blog/twix',
        likes: 100
      }
    ]
    expect(helper.totalLikes(blogs)).toBe(blogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    expect(helper.totalLikes(helper.initialBlogs)).toBe(36)
  })
})

describe('most', () => {
  test('of returning the blog with the most likes', () => {
    const blog = {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    }
    expect(helper.favoriteBlog(helper.initialBlogs)).toEqual(blog)
  })

  test('of the author with the most blogs', () => {
    const most = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(helper.mostBlogs(helper.initialBlogs)).toEqual(most)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
