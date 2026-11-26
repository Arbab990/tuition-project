import React from 'react'
import { GraduationCap, Presentation, ExternalLink, ClipboardPenLine, LockKeyhole } from 'lucide-react'
import './form.css'
import WhatsAppContact from './WhatsAppContact'

const audiences = {
  student: {
    title: 'Student enquiry',
    description: 'Tell us where you are in your studies and what you’d like help with.',
    url: import.meta.env.VITE_STUDENT_FORM_URL,
    fields: [
      ['Student name', 'Full name'],
      ['Parent or guardian email', 'name@example.com'],
      ['Contact number', '+91'],
      ['City', 'Your city'],
      ['Class and board', 'e.g. Class 10, CBSE'],
      ['Subjects of interest', 'e.g. Maths and Science'],
      ['Learning goals', 'What would you like to work on?']
    ]
  },
  teacher: {
    title: 'Teacher application',
    description: 'Introduce yourself and tell us about the learners you’d like to teach.',
    url: import.meta.env.VITE_TEACHER_FORM_URL,
    fields: [
      ['Teacher name', 'Full name'],
      ['Email address', 'name@example.com'],
      ['Contact number', '+91'],
      ['City', 'Your city'],
      ['Subjects and classes taught', 'e.g. Maths, Classes 9–12'],
      ['Qualifications and experience', 'e.g. B.Ed., 3 years'],
      ['Availability', 'Which days and times suit you?']
    ]
  }
}

function responseUrl(value) {
  try {
    const url = new URL(value)
    if (url.origin !== 'https://docs.google.com' || !/^\/forms\/d\/(?:e\/)?[\w-]+\/viewform\/?$/.test(url.pathname)) return null
    return url.origin + url.pathname
  } catch {
    return null
  }
}

export default function Enquiry({ role, setRole }) {
  const selected = role === 'teacher' ? 'teacher' : 'student'
  const audience = audiences[selected]
  const url = responseUrl(audience.url)

  return (
    <section className="sf-enquiry" id="enquiry" aria-labelledby="enquiry-heading">
      <div className="sf-enquiry-inner">
        <div className="sf-enquiry-intro">
          <span className="sf-enquiry-kicker"><ClipboardPenLine size={17} /> ENQUIRIES & ADMISSIONS</span>
          <h2 id="enquiry-heading">Let’s get <em>in touch.</em></h2>
          <p>Find support for your studies or bring your teaching experience to Studyfolk.</p>
          <WhatsAppContact />
          <div className="sf-role-switch" role="group" aria-label="Enquiry type">
            {Object.entries({ student: GraduationCap, teacher: Presentation }).map(([key, Icon]) => (
              <button key={key} type="button" aria-pressed={selected === key} onClick={() => setRole(key)}>
                <Icon size={18} />{key === 'student' ? 'Student' : 'Teacher'}
              </button>
            ))}
          </div>
        </div>
        <div className="sf-enquiry-card" key={selected}>
          <h3>{audience.title}</h3>
          <p>{audience.description}</p>
          {url ? (
            <>
              <iframe src={url + '?embedded=true'} title={audience.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
              <a className="sf-external-form" href={url} target="_blank" rel="noopener noreferrer">Open form in a new tab <ExternalLink size={16} /></a>
            </>
          ) : (
            <>
              <div className="sf-form-status"><LockKeyhole size={16} aria-hidden="true" />Online submissions are currently closed.</div>
              <fieldset className="sf-form-preview" disabled>
                <legend className="sf-visually-hidden">{audience.title} preview</legend>
                {audience.fields.map(([label, hint], index) => (
                  <label key={label} className={index === audience.fields.length - 1 ? 'sf-wide-field' : ''}>
                    {label}<input placeholder={hint} />
                  </label>
                ))}
              </fieldset>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
