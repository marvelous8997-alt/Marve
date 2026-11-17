"use client";

import {
  BarChart3,
  CreditCard,
  IndianRupee,
  ShoppingBag,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ========================= Types ========================= */

export interface SalesTrendData {
  label: string;
  sales: number;
}

export interface OrdersTrendData {
  label: string;
  orders: number;
}

export interface CategorySalesData {
  name: string;
  sales: number;
}

export interface PaymentMethodData {
  name: string;
  value: number;
}

interface ReportTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: string | number;
    name?: string;
  }>;
  label?: string;
}

/* ========================= Props ========================= */

interface ReportsChartProps {
  salesTrend?: SalesTrendData[];
  ordersTrend?: OrdersTrendData[];
  categorySales?: CategorySalesData[];
  paymentMethods?: PaymentMethodData[];
}

/* ========================= Default Demo Data ========================= */

const DEFAULT_SALES_TREND: SalesTrendData[] = [
  {
    label: "01 Sep",
    sales: 18500,
  },
  {
    label: "05 Sep",
    sales: 24200,
  },
  {
    label: "10 Sep",
    sales: 21800,
  },
  {
    label: "15 Sep",
    sales: 32600,
  },
  {
    label: "20 Sep",
    sales: 28400,
  },
  {
    label: "25 Sep",
    sales: 39100,
  },
  {
    label: "30 Sep",
    sales: 44800,
  },
];

const DEFAULT_ORDERS_TREND: OrdersTrendData[] = [
  {
    label: "01 Sep",
    orders: 18,
  },
  {
    label: "05 Sep",
    orders: 25,
  },
  {
    label: "10 Sep",
    orders: 22,
  },
  {
    label: "15 Sep",
    orders: 34,
  },
  {
    label: "20 Sep",
    orders: 29,
  },
  {
    label: "25 Sep",
    orders: 41,
  },
  {
    label: "30 Sep",
    orders: 47,
  },
];

const DEFAULT_CATEGORY_SALES: CategorySalesData[] = [
  {
    name: "Kitchen",
    sales: 42500,
  },
  {
    name: "Cookware",
    sales: 34800,
  },
  {
    name: "Dining",
    sales: 28600,
  },
  {
    name: "Storage",
    sales: 22400,
  },
  {
    name: "Decor",
    sales: 18700,
  },
];

const DEFAULT_PAYMENT_METHODS: PaymentMethodData[] = [
  {
    name: "UPI",
    value: 42,
  },
  {
    name: "Card",
    value: 28,
  },
  {
    name: "COD",
    value: 18,
  },
  {
    name: "Net Banking",
    value: 8,
  },
  {
    name: "Wallet",
    value: 4,
  },
];

/* ========================= Theme ========================= */

const CHART_COLORS = [
  "#6B3E1E",
  "#A66A32",
  "#8B5E34",
  "#C09A6B",
  "#D8C3AA",
];

/* ========================= Component ========================= */

export default function ReportsChart({
  salesTrend = DEFAULT_SALES_TREND,
  ordersTrend = DEFAULT_ORDERS_TREND,
  categorySales = DEFAULT_CATEGORY_SALES,
  paymentMethods = DEFAULT_PAYMENT_METHODS,
}: ReportsChartProps) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {/* ========================= Sales Trend ========================= */}

      <ChartCard
        icon={IndianRupee}
        title="Sales Trend"
        description="Revenue performance over the selected period"
      >
        <div className="h-[300px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={salesTrend}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#6B3E1E"
                opacity={0.08}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A0958C",
                  fontSize: 10,
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A0958C",
                  fontSize: 10,
                }}
                tickFormatter={(value) =>
                  formatCompactPrice(value)
                }
              />

              <Tooltip
                content={<SalesTooltip />}
              />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6B3E1E"
                strokeWidth={2.2}
                dot={{
                  r: 3,
                  fill: "#6B3E1E",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "#A66A32",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ========================= Orders Trend ========================= */}

      <ChartCard
        icon={ShoppingBag}
        title="Orders Trend"
        description="Order activity over the selected period"
      >
        <div className="h-[300px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={ordersTrend}
              margin={{
                top: 10,
                right: 8,
                left: -18,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#6B3E1E"
                opacity={0.08}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A0958C",
                  fontSize: 10,
                }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#A0958C",
                  fontSize: 10,
                }}
                allowDecimals={false}
              />

              <Tooltip
                content={<OrdersTooltip />}
              />

              <Line
                type="monotone"
                dataKey="orders"
                stroke="#A66A32"
                strokeWidth={2.2}
                dot={{
                  r: 3,
                  fill: "#A66A32",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "#6B3E1E",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ========================= Category Sales ========================= */}

<ChartCard
  icon={BarChart3}
  title="Category Sales"
  description="Sales performance by product category"
>
  <div className="h-[300px] w-full">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
      <BarChart
        data={categorySales.map((item) => ({
          name: item.name,
          sales: Number(item.sales),
        }))}
        margin={{
          top: 10,
          right: 8,
          left: -18,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#6B3E1E"
          opacity={0.08}
          vertical={false}
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#A0958C",
            fontSize: 10,
          }}
          dy={8}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#A0958C",
            fontSize: 10,
          }}
          tickFormatter={(value) =>
            formatCompactPrice(Number(value))
          }
        />

        <Tooltip
          content={<CategoryTooltip />}
        />

        <Bar
          dataKey="sales"
          radius={[7, 7, 0, 0]}
          maxBarSize={42}
        >
          {categorySales.map((entry, index) => (
            <Cell
              key={`${entry.name}-${index}`}
              fill={
                CHART_COLORS[
                  index % CHART_COLORS.length
                ]
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</ChartCard>

      {/* ========================= Payment Methods ========================= */}

      <ChartCard
        icon={CreditCard}
        title="Payment Methods"
        description="Payment method distribution"
      >
        <div className="h-[300px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={paymentMethods}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={68}
                outerRadius={102}
                paddingAngle={3}
                stroke="#FFFFFF"
                strokeWidth={2}
              >
                {paymentMethods.map(
                  (entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={
                        CHART_COLORS[
                          index %
                            CHART_COLORS.length
                        ]
                      }
                    />
                  ),
                )}
              </Pie>

              <Tooltip
                content={<PaymentTooltip />}
              />

              <Legend
                verticalAlign="bottom"
                height={28}
                iconType="circle"
                iconSize={7}
                formatter={(value) => (
                  <span className="text-[10px] font-medium text-[#8A7D72]">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  );
}

/* ========================= Chart Card ========================= */

function ChartCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
  }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#6B3E1E]/10 bg-white p-4 shadow-[0_4px_18px_rgba(41,35,31,0.035)] sm:p-5">
      {/* ========================= Header ========================= */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6B3E1E]/8 text-[#6B3E1E]">
            <Icon
              size={17}
              strokeWidth={1.7}
            />
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-[-0.01em] text-[#29231F]">
              {title}
            </h3>

            <p className="mt-0.5 text-[10px] font-medium text-[#A0958C]">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* ========================= Chart ========================= */}

      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

/* ========================= Sales Tooltip ========================= */

function SalesTooltip({
  active,
  payload,
  label,
}: ReportTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0]?.value ?? 0);

  return (
    <TooltipContainer>
      <p className="text-[10px] font-semibold text-[#A0958C]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#6B3E1E]">
        Sales: {formatPrice(value)}
      </p>
    </TooltipContainer>
  );
}

/* ========================= Orders Tooltip ========================= */

function OrdersTooltip({
  active,
  payload,
  label,
}: ReportTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0]?.value ?? 0);

  return (
    <TooltipContainer>
      <p className="text-[10px] font-semibold text-[#A0958C]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#A66A32]">
        Orders: {value}
      </p>
    </TooltipContainer>
  );
}

/* ========================= Category Tooltip ========================= */

function CategoryTooltip({
  active,
  payload,
  label,
}: ReportTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = Number(payload[0]?.value ?? 0);

  return (
    <TooltipContainer>
      <p className="text-[10px] font-semibold text-[#A0958C]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#6B3E1E]">
        Sales: {formatPrice(value)}
      </p>
    </TooltipContainer>
  );
}

/* ========================= Payment Tooltip ========================= */

function PaymentTooltip({
  active,
  payload,
}: ReportTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <TooltipContainer>
      <p className="text-xs font-semibold text-[#29231F]">
        {item?.name}
      </p>

      <p className="mt-1 text-[10px] font-medium text-[#8A7D72]">
        Usage: {Number(item?.value ?? 0)}%
      </p>
    </TooltipContainer>
  );
}

/* ========================= Tooltip Container ========================= */

function TooltipContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#6B3E1E]/10 bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(41,35,31,0.10)]">
      {children}
    </div>
  );
}

/* ========================= Price Formatter ========================= */

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/* ========================= Compact Price ========================= */

function formatCompactPrice(value: number) {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
}