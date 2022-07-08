import { DelLessonReq, Lessons, SetLessonReq } from '../model'
import { apiSlice } from './app.api'

export const ProfileApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    lessons: builder.query<Lessons, void>({
      query: (body) => ({
        url: 'getLessons',
        method: 'get',
        body
      })
    }),
    setLesson: builder.mutation<Lessons[number]['days'], SetLessonReq>({
      query: (body) => ({
        url: 'setLesson',
        method: 'put',
        body
      })
    }),
    delLesson: builder.mutation<Lessons[number]['days'], DelLessonReq>({
      query: (body) => ({
        url: 'delLesson',
        method: 'delete',
        body
      })
    }),
  })
})

export const { useLessonsQuery, useSetLessonMutation, useDelLessonMutation } = ProfileApiSlice