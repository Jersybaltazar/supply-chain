'use server'

import { revalidateTag } from 'next/cache'
import { fetchGraphQLServer } from '../fetch/server'
import { CreateRetailerDocument, namedOperations } from '../queries/generated'

export async function createRetailer({ uid }: { uid: string }) {
  try {
    await fetchGraphQLServer({
      document: CreateRetailerDocument,
      variables: {
        createRetailerInput: {
          uid,
        },
      },
    })

    revalidateTag(namedOperations.Query.retailer)
  } catch (error) {
    throw new Error('Something went wrong')
  }
}
