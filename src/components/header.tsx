import { SpookyPunkIcon } from "@/components/icons";

type HeaderProps = {
  userId: string | null;
};

export default function Header({ userId }: HeaderProps) {
  return (
    <header className="py-4 px-6 border-b border-primary/20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SpookyPunkIcon className="text-primary h-8 w-8" />
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-gray-100 tracking-wider">
            Spooky Punks
          </h1>
        </div>
        <div className="font-code text-xs p-2 bg-secondary rounded-md text-primary-foreground">
          {userId ? (
            <>
              <span className="hidden sm:inline">User ID: </span>
              <span className="text-primary font-bold">{userId.slice(0, 8)}...</span>
            </>
          ) : (
            "Connecting..."
          )}
        </div>
      </div>
    </header>
  );
}
