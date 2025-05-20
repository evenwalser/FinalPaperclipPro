// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export function RecentSales() {
//   return (
//     <div className="space-y-8">
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/avatars/01.png" alt="Avatar" />
//           <AvatarFallback>OM</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Olivia Martin</p>
//           <p className="text-sm text-muted-foreground">
//             olivia.martin@email.com
//           </p>
//         </div>
//         <div className="ml-auto font-medium">£1,999.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/avatars/02.png" alt="Avatar" />
//           <AvatarFallback>JL</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Jackson Lee</p>
//           <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">£39.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/avatars/03.png" alt="Avatar" />
//           <AvatarFallback>IN</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
//           <p className="text-sm text-muted-foreground">
//             isabella.nguyen@email.com
//           </p>
//         </div>
//         <div className="ml-auto font-medium">£299.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/avatars/04.png" alt="Avatar" />
//           <AvatarFallback>WK</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">William Kim</p>
//           <p className="text-sm text-muted-foreground">will@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">£99.00</div>
//       </div>
//       <div className="flex items-center">
//         <Avatar className="h-9 w-9">
//           <AvatarImage src="/avatars/05.png" alt="Avatar" />
//           <AvatarFallback>SD</AvatarFallback>
//         </Avatar>
//         <div className="ml-4 space-y-1">
//           <p className="text-sm font-medium leading-none">Sofia Davis</p>
//           <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
//         </div>
//         <div className="ml-auto font-medium">£39.00</div>
//       </div>
//     </div>
//   )
// }

// components/RecentSales.tsx
import { RecentSale } from "@/lib/services/recentSales";

export function RecentSales({ data }: { data: RecentSale[] }) {
  console.log('here are recent sales', data)
  return (
    <div className="space-y-6">
      {data.map((sale) => (
        <div key={sale.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-[#262626]">{sale?.customers && sale.customers.name ? sale.customers.name.charAt(0) : 'C'}</span>
            </div>
            <div className="">
              <p className="text-[14px] text-white">{sale?.customers && sale.customers.name ? sale.customers.name : 'No email available'}</p>
              <p className="text-[14px] text-[#666]">
              {sale?.customers && sale.customers.email ? sale.customers.email : 'No email available'}

              {/* {new Date(sale.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })} */}
              </p>
            </div>
          </div>
          <div className="ml-4">
            <p className="font-medium text-right">
              £{sale.total_amount}
            </p>
            <p className="text-sm text-muted-foreground text-right">
              {sale.payment_method}
            </p>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-muted-foreground text-center">No recent sales</p>
      )}
    </div>
  );
}