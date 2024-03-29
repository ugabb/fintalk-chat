import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IBody {
  senderId: string;
  recipientId: string;
  conversationId: string;
}

// Função assíncrona que lida com requisições HTTP do tipo POST
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    // Obtém o corpo da requisição como JSON
    const body: IBody = await request.json();

    // Extrai informações do corpo da requisição
    const { senderId, recipientId, conversationId } = body;

    if (!senderId || !recipientId || !conversationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingRequest = await prisma.groupInviteRequest.findFirst({
      where: {
        AND: [{ senderId }, { recipientId }, { conversationId }],
      },
    });

    if (existingRequest) {
      new NextResponse("Already sent", { status: 400 });
    }

    const groupRequest = await prisma.groupInviteRequest.create({
      data: {
        conversation: { connect: { id: conversationId } },
        status: "pending",
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      } as any,
      include: {
        conversation: true,
      },
    });

    const userRecipient = await prisma.user.findFirst({
      where: {
        id: recipientId,
      },
    });

    await pusherServer.trigger(
      userRecipient?.email,
      "groupRequest:new",
      groupRequest
    );
    console.log(groupRequest);
    return NextResponse.json({
      message: "Group invite request sent",
      groupRequest,
    });
  } catch (error) {
    console.log(error);
    // Se ocorrer um erro não relacionado à validação do esquema, retornar uma resposta com status 400 (Bad Request)
    return new NextResponse("Error", { status: 500 });
  }
}
