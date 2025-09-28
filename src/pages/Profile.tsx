import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your bookings and account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Profile page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;