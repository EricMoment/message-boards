'use client'
import React, { useState } from 'react'
import { createMessage } from '@/lib'

import './MessageForm.css'

export default function MessageForm({currentUser} : any) {
  const [errMessage, setErrMessage] = useState(' ')
  const [textLength, setTextLength] = useState(0)
  const [canPost, setCanPost] = useState(true)
  async function handleSubmit(e: any) {
    e.preventDefault()
    if (!canPost) return setErrMessage('Sorry, you can only post once every 10 seconds.')
    setCanPost(false)
    setTimeout(() => { setCanPost(true) }, 10000);
    const formData = new FormData()
    formData.append('content', e.target[0].value)
    await createMessage(formData).then((e) => {
      return setErrMessage(e)
    })
  }
  function handleChange(e: any) {
    let value = e.target.value
    setTextLength(value.length)
  }
  return (
    <div className='main-page-form'>
      <form onSubmit={handleSubmit}>
        <textarea name="content"
          placeholder='Send your message...'
          className="main-page-input"
          required maxLength={150}
          onChange={handleChange}>
        </textarea>
        <div className='main-page-remaining-char'>Length: {textLength}</div>
        <div className="main-page-submit"><button type="submit">Create Message</button></div>
      </form>
      <div className="main-page-err-message">{errMessage}</div>
    </div>
  )
}