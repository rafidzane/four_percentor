import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RetirementStatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
