import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatisticCard = ({ title, value, icon, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-taskmaster-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
