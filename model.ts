export type Lessons = {
    lessonName: string | number;
    needReview?: boolean,
    needStudy?: boolean,
    days: { date: number, allTicked: boolean }[]
}[]

export type SetLessonReq = {
    lessonName: string | number,
    allTicked: boolean,
    date?: number
}

export type DelLessonReq = {
    lessonName: string | number,
    date: number
}