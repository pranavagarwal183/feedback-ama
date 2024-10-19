import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

// Helper function to format JSON responses
const jsonResponse = (success: boolean, message: string, status: number) => {
    return Response.json({ success, message }, { status });
};

export async function GET(request: Request) {
    await dbConnect();

    try {
        // Use new URL() to parse the request URL directly without using request.url
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Validating with zod
        const result = UsernameQuerySchema.safeParse({ username });
        console.log(result);
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return jsonResponse(
                false,
                usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
                400
            );
        }

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return jsonResponse(false, "Username is already taken", 400);
        }

        return jsonResponse(true, "Username is available", 200);
    } catch (error) {
        console.error("Error checking username", error);
        return jsonResponse(false, "Error checking username", 500);
    }
}
