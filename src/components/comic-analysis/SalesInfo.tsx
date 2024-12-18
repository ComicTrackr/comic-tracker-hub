import React from "react";

interface SalesInfoProps {
  recentGradedSales: string;
  recentUngradedSales: string;
}

export const SalesInfo = ({ recentGradedSales, recentUngradedSales }: SalesInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm md:text-base">Recent Graded Sales Range</h4>
        <p className="text-sm md:text-base whitespace-pre-line text-muted-foreground">
          {recentGradedSales}
        </p>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm md:text-base">Recent Ungraded Sales Range</h4>
        <p className="text-sm md:text-base whitespace-pre-line text-muted-foreground">
          {recentUngradedSales}
        </p>
      </div>
    </div>
  );
};