import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { BuiltInProviderType } from "next-auth/providers"
import { ClientSafeProvider, getProviders, getSession, LiteralUnion, signIn } from "next-auth/react"
import { BrandGoogle } from "tabler-icons-react";

export default function SignIn({ providers }: Props) {
  const  googleProvider = Object.values(providers)[0];
  return (
    <div className="grow flex justify-center items-center">
      <div className="bg-neutral-800 p-8 rounded-lg">
        <h2 className="text-xl font-bold">Sign in:</h2>
        <button className="flex gap-1 items-center py-2 bg-white text-neutral-900
        my-4 rounded-md font-semibold px-4"
        onClick={() => {signIn(googleProvider.id)}}>
          Sign in with Google <BrandGoogle />
        </button>
        <em className="opacity-50 font-extralight">Currently the only option.</em>
      </div>
    </div>
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