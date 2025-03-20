import {z} from 'zod'

export const createUserSchema = z.object({
  email: z.string().min(3).max(40),
  name: z.string(),
  password: z.string(),
})

export const SignUserSchema = z.object({
  email: z.string().min(3).max(40),
  password: z.string()
})

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20)
})