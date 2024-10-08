"use client";

import { FC, useEffect, useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification, User } from "@prisma/client";
import {
  deleteUserNotifications,
  seeUserNotifications,
} from "@/actions/users.actions";
import Link from "next/link";

interface Props {
  nots?: Notification[];
  authUser: User;
}

const NotificationsButton: FC<Props> = ({ nots, authUser }) => {
  const [open, setOpen] = useState(false);

  const notExpiredNots = useMemo(() => {
    return nots?.filter((not) =>
      not.expires ? not.expires.getTime() > Date.now() : false,
    );
  }, [nots]);

  useEffect(() => {
    deleteUserNotifications({ userId: authUser.id }).then((res) => {});
  }, []);

  return (
    <div>
      <Popover
        open={open}
        onOpenChange={async (open) => {
          if (open && nots?.length) {
            await seeUserNotifications({ userId: authUser.id });
          }
          if (!open) setOpen(false);
        }}
      >
        <PopoverTrigger
          asChild
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          <Button className={"relative"} size={"icon"} variant={"ghost"}>
            <Bell />
            {!!nots?.filter((not) => !not.seen).length && (
              <span
                className={
                  "absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-sm"
                }
              >
                {
                  nots.filter(
                    (not) =>
                      !not.seen ||
                      (not.expires && not.expires.getTime() < Date.now()),
                  ).length
                }
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={"max-h-[300px] min-w-[350px] overflow-auto"}>
          {!!notExpiredNots?.length ? (
            <div className={"flex flex-col gap-3"}>
              {notExpiredNots?.map((not) => {
                if (not.link) {
                  return (
                    <Link
                      onClick={() => {
                        setOpen(false);
                      }}
                      key={not.id}
                      href={not.link}
                      className="cursor-pointer hover:underline"
                    >
                      {not.text}
                    </Link>
                  );
                }
                return (
                  <div
                    onClick={() => {
                      setOpen(false);
                    }}
                    key={not.id}
                  >
                    {not.text}
                  </div>
                );
              })}
            </div>
          ) : (
            <h2 className="text-center text-destructive">Пока пусто!</h2>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { NotificationsButton };
