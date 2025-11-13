import LogInForm from "../login-form";

const page = () => {
  return (
    <div className="w-screen h-svh flex items-center justify-center">
      <LogInForm withPassword={true} />
    </div>
  );
};

export default page;
