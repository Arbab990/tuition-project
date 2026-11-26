import React, { useState } from 'react'
import { GraduationCap, Presentation, ClipboardPenLine, LockKeyhole } from 'lucide-react'
import './form.css'
import WhatsAppContact from './WhatsAppContact'

const audiences = {
  student: {
    title: 'Student enquiry',
    description: 'Tell us where you are in your studies and what you’d like help with.',
    url: import.meta.env.VITE_STUDENT_FORM_URL,
    fields: [
      [381377849, 'Student name', 'Full name'],
      [2121702829, 'Parent or guardian email', 'name@example.com'],
      [1947913022, 'Contact number', '+91'],
      [1529220314, 'City', 'Your city'],
      [1029438078, 'Class and board', 'e.g. Class 10, CBSE'],
      [804316994, 'Subjects of interest', 'e.g. Maths and Science'],
      [1306750933, 'Learning goals', 'What would you like to work on?']
    ]
  },
  teacher: {
    title: 'Teacher application',
    description: 'Introduce yourself and tell us about the learners you’d like to teach.',
    url: import.meta.env.VITE_TEACHER_FORM_URL,
    fields: [
      [420915616, 'Teacher name', 'Full name'],
      [1909521935, 'Email address', 'name@example.com'],
      [1257343129, 'Contact number', '+91'],
      [1674181336, 'City', 'Your city'],
      [841008487, 'Subjects and classes taught', 'e.g. Maths, Classes 9–12'],
      [1465473237, 'Qualifications and experience', 'e.g. B.Ed., 3 years'],
      [302000811, 'Availability', 'Which days and times suit you?']
    ]
  }
}

function submissionPath(value) {
  const match = /^https:\/\/docs\.google\.com\/forms\/d\/e\/([\w-]+)\/viewform\/?(?:\?.*)?$/.exec(value || '')
  return match ? '/enquiries/' + match[1] : null
}

function RoleForm({ audience, hidden }) {
  const [status, setStatus] = useState('idle')
  const endpoint = submissionPath(audience.url)
  const sending = status === 'sending'

  async function submit(event) {
    event.preventDefault()
    if (sending || !endpoint) return
    const form = event.currentTarget
    const body = new URLSearchParams(new FormData(form))
    setStatus('sending')
    try {
      const response = await fetch(endpoint, { method: 'POST', body, credentials: 'omit' })
      if (!response.ok) throw new Error('Submission failed')
      const page = new DOMParser().parseFromString(await response.text(), 'text/html')
      page.querySelectorAll('script, style, noscript').forEach(node => node.remove())
      if (!page.body.textContent.includes('Thank you. Studyfolk has received your details.')) {
        throw new Error('Missing confirmation')
      }
      form.reset()
      setStatus('received')
    } catch {
      setStatus('unconfirmed')
    }
  }

  return (
    <div className="sf-enquiry-card" hidden={hidden}>
      <h3>{audience.title}</h3>
      <p>{audience.description}</p>
      {!endpoint && <div className="sf-form-status"><LockKeyhole size={16} />Online submissions are currently closed.</div>}
      <form onSubmit={submit} onChange={() => setStatus('idle')}>
        <fieldset className="sf-form-preview" disabled={!endpoint || sending}>
          <legend className="sf-visually-hidden">{audience.title}</legend>
          {audience.fields.map(([id, label, hint], index) => {
            const longAnswer = index === audience.fields.length - 1
            const type = index === 1 ? 'email' : index === 2 ? 'tel' : 'text'
            return (
              <label key={id} className={longAnswer ? 'sf-wide-field' : ''}>
                {label}
                {longAnswer
                  ? <textarea name={'entry.' + id} placeholder={hint} rows={3} required />
                  : <input name={'entry.' + id} type={type} placeholder={hint} required />}
              </label>
            )
          })}
        </fieldset>
        <button className="btn orange sf-submit" disabled={!endpoint || sending} type="submit">
          {sending ? 'Sending...' : 'Submit ' + audience.title.toLowerCase()}
        </button>
        <div role="status" aria-live="polite">
          {status === 'received' && 'Thank you. Studyfolk has received your details.'}
          {status === 'unconfirmed' && 'We could not confirm receipt. Your answers are still here. Please contact Studyfolk on WhatsApp if you need help.'}
        </div>
      </form>
    </div>
  )
}

export default function Enquiry({ role, setRole }) {
  const selected = role === 'teacher' ? 'teacher' : 'student'

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
        {Object.entries(audiences).map(([key, audience]) => (
          <RoleForm key={key} audience={audience} hidden={key !== selected} />
        ))}
      </div>
    </section>
  )
}
