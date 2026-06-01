import { TransactionDetailsFragment } from '@foundation/network/src/queries/generated'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../atoms/table'
import { format } from 'date-fns'
import { getTranslations } from 'next-intl/server'

export const TransactionsTable = async ({
  transactions,
}: {
  transactions: TransactionDetailsFragment[]
}) => {
  const t = await getTranslations('Transactions')
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('quantity')}</TableHead>
            <TableHead>{t('from')}</TableHead>
            <TableHead>{t('to')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>
                {format(new Date(transaction.createdAt), 'PPp')}
              </TableCell>
              <TableCell>{transaction.product.name}</TableCell>
              <TableCell>{transaction.quantity}</TableCell>

              <TableCell>
                {transaction.fromWarehouse ? (
                  <>
                    <span className="px-2 py-1 mr-2 border border-black rounded">
                      {transaction.fromWarehouse?.id}
                    </span>
                    <span>{transaction.fromWarehouse?.name}</span>
                  </>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {transaction.toWarehouse ? (
                  <>
                    <span className="px-2 py-1 mr-2 border border-black rounded">
                      {transaction.toWarehouse?.id}
                    </span>
                    <span>{transaction.toWarehouse?.name}</span>
                  </>
                ) : (
                  '-'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
