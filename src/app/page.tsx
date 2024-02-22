import MessageForm from '../ui/MessageForm'
//import './MainPage.css'
import { DateTime } from "luxon";
import { getAllMessages }from '@/lib'
import Link from 'next/link';

function guestOrUser(msg: any) {
  if (msg.hasOwnProperty('message_user')) {
    return (
      <Link className='main-page-user-detail' 
      href={'/user/' + msg.message_user.username}>
        {msg.message_user.username}
      </Link>
    )
  } else {
    return (
      <b className='main-page-user-detail'>Guest</b>
    )
  }
}

export default async function MainPage({currentUser} : any) {
  
  const messages = await getAllMessages()

  return (
    <div className='main-page'>
      <MessageForm currentUser={currentUser}/>
      <div className='main-page-messages-container'>{messages.length === 0? 
      'There is no message' : messages.map((msg, index) => {
        let time = new Date(msg.createdAt).getTime()
        let c = DateTime.fromMillis(time).toFormat('ff')
        return (
          <div key={'main-page-message ' + index} className='main-page-message'>
            <div className='main-page-message-date'>{c}</div>
            <div className='main-page-message-content'>
              {guestOrUser(msg)}{': ' + msg.content}
            </div>
          </div>
        )
      }) }
      </div>
    </div>
  )
}
