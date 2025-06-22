import { z } from 'zod'

export const SignInUserSchema = z.object({
  email: z.string().email().min(3).max(40),
  password: z.string()
})

export const SignUpUserSchema = z.object({
  name: z.string().min(3).max(40),
  email: z.string().email().min(3).max(40),
  password: z.string().min(3).max(12),
  confirmPassword: z.string().min(3).max(12),
  
})

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20)
})