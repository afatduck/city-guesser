import { GetServerSidePropsContext } from "next"
import { BuiltInProviderType } from "next-auth/providers"
import { ClientSafeProvider, getProviders, getSession, LiteralUnion, signIn } from "next-auth/react"
import Head from "next/head";
import Link from "next/link";
import { BrandGoogle } from "tabler-icons-react";

import styles from "../../styles/page-styles/sign-in.module.css";

export default function SignIn({ providers }: Props) {
  const googleProvider = Object.values(providers)[0];
  const credentialsProvider = Object.values(providers)[1]; 
  return (
    <>
    <Head>
      <title>Sign in | EarthGuesser</title>
    </Head>
    <div className={"middle-box " + styles.body}>
      <div>
        <h2>Sign in with:</h2>
        <button onClick={() => {signIn(googleProvider.id)}}>
          Google <BrandGoogle />
        </button>
        <Link href="/auth/cred-signin">
          <button>
            Username & Password
          </button>
        </Link>
      </div>
    </div>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders()
  const session = await getSession(context)

  if (session && session.user) {
    context.res.writeHead(302, { Location: "/" })
    context.res.end()
  }

  return {
    props: { providers },
  }
}

interface Props {
    providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
}