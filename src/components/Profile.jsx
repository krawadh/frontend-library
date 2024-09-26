import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Loader2, Pen } from "lucide-react";
import Navbar from "./shared/Navbar";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { Button } from "./ui/button";

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile(user);
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center">Profile not found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:max-w-lg">
          <div className="flex flex-col md:flex-row items-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto || "https://github.com/shadcn.png"
                }
                alt={user.firstName || "User"}
              />
            </Avatar>
            <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
              <h2 className="text-2xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-sm text-gray-600">
                {user.bio || "No bio available"}
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="mt-4 md:mt-0 ml-4"
              aria-label="Edit Profile"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="font-medium text-lg">Email</h3>
              <p className="text-gray-700">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">Role</h3>
              <p className="text-gray-700">{user.role}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">Joined</h3>
              <p className="text-gray-700">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default ProfilePage;
