import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the caller is authenticated
    const serverSupabase = await createServerSupabase();
    const {
      data: { user: caller },
    } = await serverSupabase.auth.getUser();

    if (!caller) {
      return NextResponse.json(
        { error: "Niste prijavljeni." },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i lozinka su obavezni." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Lozinka mora imati najmanje 6 karaktera." },
        { status: 400 }
      );
    }

    // 3. Create admin supabase client with service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server konfiguracija nedostaje (service role key)." },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 4. Create the new user
    const { data: newUser, error: createError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // auto-confirm the email
        user_metadata: {
          full_name: fullName || email,
        },
      });

    if (createError) {
      return NextResponse.json(
        { error: createError.message },
        { status: 400 }
      );
    }

    // 5. Update the profile with the full name (trigger creates it with email)
    if (fullName && newUser.user) {
      await adminSupabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", newUser.user.id);
    }

    return NextResponse.json({
      success: true,
      message: `Evaluator ${email} je uspešno kreiran.`,
      user: {
        id: newUser.user?.id,
        email: newUser.user?.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Došlo je do greške." },
      { status: 500 }
    );
  }
}

