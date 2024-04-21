import { Separator } from "@/components/ui/separator";

export default async function PostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Posts</h3>
        <p className="text-sm text-muted-foreground">Manage your Posts</p>
      </div>
      <Separator />
    </div>
  );
}
