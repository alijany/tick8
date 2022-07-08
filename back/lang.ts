import { existsSync, readFileSync, writeFileSync, } from "fs";
import { Lessons } from "../model";

const numberOfLessons = 114

const dbPath = './db.json'


var lessons: Lessons = []


function daysFrom(date: number) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date).getTime();
    const secondDate = new Date().getTime();
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}


function createDb() {
    if (existsSync(dbPath)) return

    const file: Lessons = new Array(numberOfLessons).fill(null).map((_, index) => ({
        lessonName: index + 1,
        days: []
    }))

    writeFileSync(dbPath, JSON.stringify(file))
}


export function readLessons() {
    if (!existsSync(dbPath)) createDb();
    lessons = JSON.parse(readFileSync(dbPath).toString())
}


export function getTodayReviews() {
    return lessons.map(lesson => {
        const finishedLessons = lesson.days.filter(tick => tick.allTicked)

        const lastSession = finishedLessons.at(0)

        if (!lastSession) return { ...lesson, needReview: false }

        const daysPastFromLastLesson = daysFrom(lastSession.date)

        if (daysPastFromLastLesson >= 1 && finishedLessons.length < 8)
            return { ...lesson, needReview: true }

        if (daysPastFromLastLesson >= 15 && finishedLessons.length < 9)
            return { ...lesson, needReview: true }

        if (daysPastFromLastLesson >= 30 && finishedLessons.length < 10)
            return { ...lesson, needReview: true }

        if (daysPastFromLastLesson >= 60 && finishedLessons.length < 11)
            return { ...lesson, needReview: true }

        return { ...lesson, needReview: false }
    });
}

export function getNewLesson() {
    return lessons.findIndex(lesson => {
        if (lesson.days[0] && daysFrom(lesson.days[0].date) == 0) return true
        if (lesson.days.length == 0) return true
    });
}

export function setDay(lessonName: string | number, allTicked: boolean, date?: number) {
    const lessonIndex = lessons.findIndex(lesson => lesson.lessonName == lessonName)
    if (lessonIndex == -1) return new Error('lesson not found')
    var daysArray = lessons[lessonIndex].days

    const dayIndex = date
        ? daysArray.findIndex(day => day.date == date)
        : -1

    if (dayIndex > -1) {
        daysArray[dayIndex].allTicked = allTicked
    } else {
        const day = { date: +new Date(), allTicked }
        daysArray.push(day)
    }

    writeFileSync(dbPath, JSON.stringify(lessons))
    return daysArray
}


export function delDay(lessonName: string | number, date: number) {
    const lessonIndex = lessons.findIndex(lesson => lesson.lessonName == lessonName)
    if (lessonIndex == -1) return new Error('lesson not found')
    var daysArray = lessons[lessonIndex].days

    const dayIndex = date
        ? daysArray.findIndex(day => day.date == date)
        : -1
    if (dayIndex == -1) return new Error('session not found')

    daysArray.splice(dayIndex, 1);

    writeFileSync(dbPath, JSON.stringify(lessons))
    return daysArray
}


