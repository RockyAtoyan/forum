import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/configs/AuthConfig";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FollowButton } from "@/components/FollowButton";
import { getUserWithSubscribes } from "@/services/users.service";

import { ImageWithFallback } from "@/components/FallbackImage";

const ProfileSubscribesPage = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user.id) {
    redirect("/blog");
  }
  const user = await getUserWithSubscribes(session.user.id);
  if (!user) {
    redirect("/blog");
  }

  return (
    <div className="flex flex-col gap-4 p-5 mb-[100px]">
      <h1 className="text-lg font-semibold">Подписки</h1>
      {!!user.subscribes.length ? (
        <div className="flex flex-col gap-6">
          {user.subscribes.map(({ subscribed: sub }) => {
            return (
              <div key={sub.id} className="flex justify-between items-center">
                <Link
                  href={`/user/${sub.id}`}
                  className="flex items-center gap-5"
                >
                  <ImageWithFallback
                    src={sub.image || "/user.png"}
                    alt={"user"}
                    width={500}
                    height={500}
                    className="hidden lg:block w-[60px] h-[60px] object-cover object-center rounded-full border-2"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-semibold">{sub.name}</h3>
                    <h3 className="text-[10px] lg:text-sm text-zinc-600">
                      {sub.email}
                    </h3>
                  </div>
                </Link>
                <FollowButton
                  user={sub}
                  isFollow={true}
                  isAuth={user.id}
                  authUser={user}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Link href={"/users/1"} className={"text-destructive hover:underline"}>
          Найти интересных авторов
        </Link>
      )}
    </div>
  );
};

export default ProfileSubscribesPage;
