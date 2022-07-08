import { formatDistanceToNow } from 'date-fns-jalali';
import { useEffect, useState } from 'react';
import { Accordion, Button, Card } from "react-bootstrap";
import { FiPlay, FiPlus, FiRepeat, FiTrash, FiX } from 'react-icons/fi';
import { Lessons } from '../model';
import { useDelLessonMutation, useLessonsQuery, useSetLessonMutation } from "./api";

function Days(props: { lessonName: string | number, days: Lessons[number]['days'] }) {

    const [days, setDays] = useState(props.days)

    const [setDay, setResult] = useSetLessonMutation()

    useEffect(() => {
        if (setResult.isSuccess)
            setDays(setResult.data)
    }, [setResult])

    const [delDay, delResult] = useDelLessonMutation()

    useEffect(() => {
        if (delResult.isSuccess)
            setDays(delResult.data)
    }, [delResult.isSuccess])

    return (
        <Accordion.Body>
            {days.map(day => (
                <Card border={day.allTicked ? "success" : "danger"} key={day.date} className="mb-2">
                    <Card.Body className="d-flex align-items-center justify-content-between">
                        <div dir="rtl">{formatDistanceToNow(new Date(day.date), { addSuffix: true })}</div>
                        <div>
                            <Button
                                disabled={day.allTicked}
                                onClick={e => setDay({ date: day.date, allTicked: true, lessonName: props.lessonName })}
                                variant="success mx-1">
                                <FiPlus size={24} />
                            </Button>
                            <Button
                                disabled={!day.allTicked}
                                onClick={e => setDay({ date: day.date, allTicked: false, lessonName: props.lessonName })}
                                variant="danger mx-1">
                                <FiX size={24} />
                            </Button>
                            <Button
                                variant="dark mx-1"
                                onClick={e => delDay({ date: day.date, lessonName: props.lessonName })}
                            >
                                <FiTrash size={24} />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>))}
            <Card>
                <Card.Body className="d-flex flex-column align-items-center">
                    <div>add new session</div>
                    <div className="mt-3">
                        <Button
                            onClick={e => setDay({ allTicked: true, lessonName: props.lessonName })}
                            variant="success mx-1">
                            <FiPlus size={24} /></Button>
                        <Button
                            onClick={e => setDay({ allTicked: false, lessonName: props.lessonName })}
                            variant="danger mx-1">
                            <FiX size={24} /></Button>
                    </div>
                </Card.Body>
            </Card>
        </Accordion.Body>
    )
}

export default function App(props: {}) {
    const { data, isLoading, isFetching, isError, isSuccess } = useLessonsQuery()

    if (isLoading)
        return <div>is loading</div>

    if (isError)
        return <div>error</div>

    if (isSuccess) {
        return <Accordion className='container' style={{ opacity: isFetching ? "0.7" : "1" }}>
            {data.map(lesson => (
                <Accordion.Item eventKey={String(lesson.lessonName)} key={lesson.lessonName}>
                    <Accordion.Header>
                        {lesson.needReview && <FiRepeat className='me-2 text-primary' />}
                        {lesson.needStudy && <FiPlay className='me-2 text-success' />}
                        <span>Lesson: {lesson.lessonName}</span>
                    </Accordion.Header>
                    <Days days={lesson.days} lessonName={lesson.lessonName} />
                </Accordion.Item>
            ))}
        </Accordion>
    }

    return null
}