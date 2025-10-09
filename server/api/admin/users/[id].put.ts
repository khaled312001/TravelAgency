import { serverSupabaseServiceRole } from '#supabase/server'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Prepare update data
    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      role: body.role || 'user',
      status: body.status || 'active',
      date_of_birth: body.date_of_birth || null,
      nationality: body.nationality || null,
      passport_number: body.passport_number || null,
      passport_expiry: body.passport_expiry || null,
      updated_at: new Date().toISOString()
    }

    // Hash password if provided
    if (body.password) {
      updateData.password_hash = await bcrypt.hash(body.password, 12)
    }

    // Update user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
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
      statusMessage: 'Failed to update user'
    })
  }
})
