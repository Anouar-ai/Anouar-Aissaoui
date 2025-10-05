import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';
import { orders } from '@/lib/orders';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View details and license keys for all your past orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
                <AccordionItem value={order.id} key={order.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4 items-center">
                            <div className="text-left">
                                <p className="font-semibold text-primary">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={order.status === 'Delivered' ? 'bg-green-600' : ''}>
                                    {order.status}
                                </Badge>
                                <span className="font-bold">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>License Key</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">{item.licenseKey}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
