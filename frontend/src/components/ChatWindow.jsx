import {
    useEffect,
    useRef
} from "react";

import "./ChatWindow.css";

import {
    getCoachResponse
} from "../utils/coachResponse";


function ChatWindow({ messages = [] }) {

    // ======================================================
    // Auto Scroll Reference
    // ======================================================

    const bottomRef = useRef(null);


    // ======================================================
    // Auto Scroll When New Message Arrives
    // ======================================================

    useEffect(() => {

        if (messages.length > 0) {

            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });

        }

    }, [messages]);


    // ======================================================
    // Get Clean Message Text
    // ======================================================

    const getMessageText = (msg) => {

        if (!msg) {
            return "";
        }


        // ==================================================
        // Customer Message
        // ==================================================

        if (msg.sender === "customer") {

            if (typeof msg.text === "string") {
                return msg.text;
            }

            return "";
        }


        // ==================================================
        // AI Coach Message
        // ==================================================

        /*
            Backend sometimes returns the coach response
            as JSON / JSON-like text.

            getCoachResponse() extracts only:

            recommended_response
        */

        const cleanResponse = getCoachResponse(
            msg.text
        );

        if (cleanResponse) {
            return cleanResponse;
        }


        // ==================================================
        // Fallback
        // ==================================================

        if (typeof msg.text === "string") {
            return msg.text;
        }


        // If msg.text itself is an object
        if (
            typeof msg.text === "object" &&
            msg.text !== null
        ) {

            if (
                typeof msg.text.recommended_response
                === "string"
            ) {

                return msg.text.recommended_response;
            }

        }


        return "";
    };


    // ======================================================
    // Get Message Time
    // ======================================================

    const getMessageTime = (msg) => {

        /*
            If timestamp exists in the message object,
            use the original message timestamp.
        */

        if (msg?.timestamp) {

            const date = new Date(
                msg.timestamp
            );

            if (!Number.isNaN(date.getTime())) {

                return date.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            }

        }


        /*
            Fallback for old messages that don't
            contain timestamp yet.
        */

        return new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="chat-window">

            {

                messages.length === 0 ? (

                    // ==========================================
                    // Empty Chat
                    // ==========================================

                    <div className="empty-chat">

                        <h3>
                            👋 Welcome
                        </h3>

                        <p>
                            Start a conversation with the AI
                            Customer Support Coach.
                        </p>

                    </div>

                ) : (

                    // ==========================================
                    // Conversation
                    // ==========================================

                    <>

                        {

                            messages.map(
                                (msg, index) => {

                                    const messageText =
                                        getMessageText(
                                            msg
                                        );

                                    const messageTime =
                                        getMessageTime(
                                            msg
                                        );


                                    return (

                                        <div
                                            key={
                                                msg.id ||
                                                `${msg.sender}-${index}`
                                            }
                                            className={
                                                `message ${msg.sender}`
                                            }
                                        >

                                            <div className="bubble">


                                                {/* ==================
                                                    Sender
                                                ================== */}

                                                <div className="sender">

                                                    {

                                                        msg.sender ===
                                                        "customer"

                                                            ? "👤 Customer"

                                                            : "🤖 AI Coach"

                                                    }

                                                </div>


                                                {/* ==================
                                                    Message
                                                ================== */}

                                                <div className="message-text">

                                                    {
                                                        messageText
                                                    }

                                                </div>


                                                {/* ==================
                                                    Time
                                                ================== */}

                                                <div className="time">

                                                    {
                                                        messageTime
                                                    }

                                                </div>


                                            </div>

                                        </div>

                                    );

                                }
                            )

                        }


                        {/* ==============================
                            Auto Scroll Target
                        ============================== */}

                        <div
                            ref={bottomRef}
                            className="chat-bottom"
                        />

                    </>

                )

            }

        </div>

    );

}


export default ChatWindow;