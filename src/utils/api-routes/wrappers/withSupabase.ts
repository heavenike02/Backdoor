import { createSupabaseUserServerPagesClient } from '@/supabase-clients/user/createSupabaseUserServerPagesClient';
import { AppSupabaseClient } from '@/types';
import { Session, User } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { enableCors } from '../enable-cors';

/**
 * This is a wrapper for API routes that simply passes
 * the Supabase client, the session and the user object to the wrapped function.
 */
export const withSupabase = (
  cb: (
    req: NextApiRequest,
    res: NextApiResponse,
    supabaseClient: AppSupabaseClient,
    session: Session | null,
    user: User | null,
  ) => void,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabaseClient = createSupabaseUserServerPagesClient({ req, res });
    enableCors(req, res);

    // return ok if options request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    const sessionInfo = await supabaseClient.auth.getSession();
    const session = sessionInfo?.data.session ?? null;
    const user = session?.user ?? null;
    return cb(req, res, supabaseClient, session, user);
  };
};
