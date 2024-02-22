'use server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Import the revalidatePath and redirect functions from Next.js
import { redirect } from 'next/navigation'

// Import the Zod library for validation
import { z } from 'zod'

// Define a schema for the post using Zod
const messageGuestSchema = z.object({
    // the content must be a string between 20 and 150 characters
    content: z.string().trim().min(20).max(150),
})

export async function getAllMessages() {
  try {
  const guestMessages = await prisma.messageGuest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  })
    return guestMessages
  } catch(err) {
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function createMessage(formData:any) {
    const result = messageGuestSchema.safeParse({
      content: formData.get('content'),
    })

    // If validation fails, return the errors
    if (!result.success) {
      let msg = result.error.flatten().fieldErrors.content
      if (msg != undefined) {
        return msg![0]
      } else {
        return 'Something went wrong'
      }
    }
    try {
      // If validation passes, create a new post in the database
      await prisma.messageGuest.create({
        data: {
          content: result.data.content,
        }
      }).then(e => console.log(typeof(e.createdAt)))
    } catch (error: unknown) {
      // If there's an error, return it
      if (error instanceof Error) {
        return error.message
      } else {
        return 'Something went wrong'
      }
    }

    // Revalidate the path and redirect to the home page
    revalidatePath('/')
    redirect('/')
}