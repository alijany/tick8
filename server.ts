// Require the framework and instantiate it

import $fastify, { FastifyRequest } from "fastify"
import path from "path"
import { DelLessonReq, SetLessonReq } from "./model"
import { delDay, getNewLesson, getTodayReviews, readLessons, setDay } from "./back/lang"

readLessons()

const fastify = $fastify({ logger: true })

fastify.register(require('@fastify/cors'), {
  // put your options here
})

fastify.register(require('@fastify/static'), {
  root: path.resolve('./dist'),
})

fastify.get('/', async (request, reply: any) => {
  return reply.sendFile('index.html')
})

// Declare a route
fastify.get('/getLessons', async (request, reply) => {
  const lessons = getTodayReviews();
  const newLesson = getNewLesson();
  if (newLesson != -1)
    lessons[newLesson].needStudy = true
  return lessons
})

fastify.put('/setLesson', async (request: FastifyRequest<{ Body: SetLessonReq }>, reply) => {
  const res = setDay(request.body.lessonName, request.body.allTicked, request.body.date)
  if (res instanceof Error) {
    reply.code(404)
    return res
  }
  return res
})

fastify.delete('/delLesson', async (request: FastifyRequest<{ Body: DelLessonReq }>, reply) => {
  const res = delDay(request.body.lessonName, request.body.date)
  if (res instanceof Error) {
    reply.code(404)
    return res
  }
  return res
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ host: '0.0.0.0', port: 80 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()