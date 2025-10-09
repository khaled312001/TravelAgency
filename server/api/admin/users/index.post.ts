import { serverSupabaseServiceRole } from '#supabase/server'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)

    // Validate required fields
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // Create user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name: body.name,
        email: body.email,
        password_hash: hashedPassword,
        phone: body.phone || null,
        role: body.role || 'user',
        status: body.status || 'active',
        date_of_birth: body.date_of_birth || null,
        nationality: body.nationality || null,
        passport_number: body.passport_number || null,
        passport_expiry: body.passport_expiry || null
      })
      .select()
      .single()

    if (userError) {
      throw createError({
        statusCode: 400,
        statusMessage: userError.message
      })
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = userData

    return {
      success: true,
      user: userWithoutPassword
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})
