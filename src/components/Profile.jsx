import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user } = useSelector((store) => store.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfile(user);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  user?.profile?.profilePhoto
                    ? user.profile.profilePhoto
                    : "https://github.com/shadcn.png"
                }
                alt={user.firstName || "User"}
              />
            </Avatar>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">{user.firstName}</h2>
              <p className="text-sm text-gray-600">
                {user.bio || "No bio available"}
              </p>
            </div>
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
          {/* <Button
            onClick={() => navigate(`/edit-profile/${user._id}`)}
            className="w-full mt-4"
          >
            <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
