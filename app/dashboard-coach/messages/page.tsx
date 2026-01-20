'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Conversation {
    id: string;
    clientPhone: string;
    clientName: string | null;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    status: string;
}

interface Message {
    id: string;
    from_phone: string;
    to_phone: string;
    body: string;
    direction: 'inbound' | 'outbound';
    status: string;
    created_at: string;
}

export default function CoachMessagesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        checkAuth();
        loadConversations();

        // Subscribe to real-time message updates
        const subscription = supabase
            .channel('whatsapp_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'whatsapp_messages'
            }, () => {
                loadConversations();
                if (selectedConversation) {
                    loadMessages(selectedConversation.id);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/login');
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'coach') {
            router.push('/dashboard');
            return;
        }

        setUser(user);
    };

    const loadConversations = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/whatsapp/conversations', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setConversations(data.conversations || []);
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conversationId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`/api/whatsapp/conversations/${conversationId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        loadMessages(conversation.id);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('/api/whatsapp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    to: selectedConversation.clientPhone,
                    message: newMessage,
                    conversationId: selectedConversation.id,
                }),
            });

            if (response.ok) {
                setNewMessage('');
                await loadMessages(selectedConversation.id);
                await loadConversations();
            } else {
                const error = await response.json();
                alert('Erreur: ' + (error.error || 'Échec de l\'envoi'));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erreur lors de l\'envoi du message');
        } finally {
            setSending(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-2xl font-bold text-gradient">
                            Fitbuddy Coach
                        </Link>
                        <span className="text-gray-400">|</span>
                        <h1 className="text-lg font-semibold text-gray-900">Messages WhatsApp</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-60px)]">
                {/* Conversations List */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-900">Conversations</h2>
                        <p className="text-sm text-gray-500">{conversations.length} conversation(s)</p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Chargement...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Aucune conversation
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-semibold">
                                                {(conv.clientName || conv.clientPhone).charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {conv.clientName || conv.clientPhone}
                                                </p>
                                                <p className="text-xs text-gray-500">{conv.clientPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-gray-500">
                                                {formatTime(conv.lastMessageAt)}
                                            </span>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-[#25D366] text-white text-xs rounded-full px-2 py-0.5">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {conv.lastMessage || 'Aucun message'}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-200 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-semibold">
                                        {(selectedConversation.clientName || selectedConversation.clientPhone).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {selectedConversation.clientName || 'Client'}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedConversation.clientPhone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        Aucun message dans cette conversation
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-md px-4 py-2 rounded-2xl ${msg.direction === 'outbound'
                                                        ? 'bg-[#25D366] text-white'
                                                        : 'bg-white text-gray-900 border border-gray-200'
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                                                <p className={`text-xs mt-1 ${msg.direction === 'outbound' ? 'text-white/70' : 'text-gray-500'
                                                    }`}>
                                                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Composer */}
                            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrire un message..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="bg-[#25D366] text-white px-6 py-3 rounded-full hover:bg-[#20BA5A] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending ? 'Envoi...' : 'Envoyer'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Sélectionnez une conversation
                                </h3>
                                <p className="text-gray-600">
                                    Choisissez une conversation dans la liste pour voir les messages
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
