import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Define public routes that do not require authentication
  const publicRoutes = ['/login', '/reset-password', '/update-password', '/accept-invite', '/signup', '/auth/callback', '/api/webhooks/paperclip-item-created']
  
  // Define route permissions with their allowed roles
  const routePermissions = {
    '/': ['store_owner','user'], // Add home page restriction
    '/dashboard': ['store_owner','user'],
    '/inventory': ['sales_associate', 'store_owner','user'],
    '/inventory/edit/:id': ['store_owner','user'],
    '/inventory/add': ['store_owner','user'],
    '/pos': ['sales_associate', 'store_owner','user']  // Added POS route
    // Add more route-role mappings as needed
  }

  const pathname = request.nextUrl.pathname

  // If this is a public route, allow access without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in, redirect to login page
  if (!user) {
    console.log('User not logged in, redirecting to login page')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Get user role from the database
  let userRole = null
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    userRole = userData?.role
  }

  // Check if the route requires role-based access
  const matchingRoute = Object.entries(routePermissions)
    .filter(([route]) => pathname.startsWith(route))
    .sort((a, b) => b[0].length - a[0].length)[0]

  const requiredRoles = matchingRoute?.[1]

  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    // Handle unauthorized access based on role
    if (userRole === 'sales_associate') {
      // Redirect sales associates to inventory page
      return NextResponse.redirect(new URL('/inventory', request.url))
    }
    // For all other unauthorized access, redirect to inventory
    return NextResponse.redirect(new URL('/inventory', request.url))
  }

  return supabaseResponse
}