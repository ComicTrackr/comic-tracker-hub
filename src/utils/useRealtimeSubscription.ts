import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSubscription = (
  table: string,
  callback: () => void
) => {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          () => {
            callback();
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, callback]);
};