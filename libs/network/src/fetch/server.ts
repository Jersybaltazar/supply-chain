import { cookies } from 'next/headers'
import { FetchResult, GraphqlRequestOptions, fetchGraphqlStatic } from '.'

export async function fetchGraphQLServer<TData, V>({
  document,
  variables,
  apiSecret,
  config,
}: Omit<GraphqlRequestOptions<TData, V>, 'token'>): Promise<
  FetchResult<TData>
> {
  const getCookies = cookies()
  // En producción (HTTPS) NextAuth usa el prefijo "__Secure-"; en local no.
  const token =
    getCookies.get('__Secure-next-auth.session-token')?.value ||
    getCookies.get('next-auth.session-token')?.value ||
    ''

  return fetchGraphqlStatic({ document, apiSecret, config, variables, token })
}
