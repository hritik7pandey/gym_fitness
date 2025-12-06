import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';

/**
 * GET /api/plans
 * Fetch all active plans (public endpoint)
 * Returns plans sorted by displayOrder
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch all active plans, sorted by displayOrder
        const plans = await Plan.find({ isActive: true }).sort({ displayOrder: 1 });

        return NextResponse.json({
            success: true,
            plans,
        });
    } catch (error: any) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch plans',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
