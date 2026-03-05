import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "settings";
type SettingsSection = "profile" | "privacy" | "notifications" | "deleteAccount";

interface Message {
  id: number;
  text: string;
  isMe: boolean;
  time: string;
  encrypted?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  color: string;
}

const CHATS: Chat[] = [
  { id: 1, name: "Аня 🌸", avatar: "А", lastMsg: "Привет! Как дела? 🥰", time: "14:32", unread: 3, online: true, color: "from-pink-200 to-rose-200" },
  { id: 2, name: "Максим", avatar: "М", lastMsg: "Ок, увидимся!", time: "13:10", unread: 0, online: true, color: "from-violet-200 to-purple-200" },
  { id: 3, name: "Лера 🦋", avatar: "Л", lastMsg: "Смотри что нашла 😍", time: "вчера", unread: 1, online: false, color: "from-sky-200 to-cyan-200" },
  { id: 4, name: "Даня", avatar: "Д", lastMsg: "Где тусовка сегодня?", time: "вчера", unread: 0, online: false, color: "from-emerald-200 to-teal-200" },
  { id: 5, name: "Катя ✨", avatar: "К", lastMsg: "отпад просто", time: "пн", unread: 0, online: true, color: "from-amber-200 to-orange-200" },
  { id: 6, name: "Рабочая группа", avatar: "Р", lastMsg: "Созвон в 17:00", time: "пн", unread: 5, online: false, color: "from-indigo-200 to-blue-200" },
];

const CONTACTS: Contact[] = [
  { id: 1, name: "Аня 🌸", avatar: "А", status: "Живу на максималках ✨", online: true, color: "from-pink-200 to-rose-200" },
  { id: 2, name: "Максим", avatar: "М", status: "На работе 💼", online: true, color: "from-violet-200 to-purple-200" },
  { id: 3, name: "Лера 🦋", avatar: "Л", status: "Тихий час 😴", online: false, color: "from-sky-200 to-cyan-200" },
  { id: 4, name: "Даня", avatar: "Д", status: "В спортзале 💪", online: false, color: "from-emerald-200 to-teal-200" },
  { id: 5, name: "Катя ✨", avatar: "К", status: "Кофе и музыка ☕", online: true, color: "from-amber-200 to-orange-200" },
];

const MESSAGES_INIT: Message[] = [
  { id: 1, text: "Привет! Как дела? 🥰", isMe: false, time: "14:30", encrypted: true },
  { id: 2, text: "Привет! Отлично, спасибо ✨ А у тебя?", isMe: true, time: "14:31", encrypted: true },
  { id: 3, text: "Тоже хорошо! Что делаешь вечером? 🌙", isMe: false, time: "14:31", encrypted: true },
  { id: 4, text: "Пока ничего не планировал. Может кино?", isMe: true, time: "14:32", encrypted: true },
  { id: 5, text: "Да, давай! 🎬🍿", isMe: false, time: "14:32", encrypted: true },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(MESSAGES_INIT);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0);
  const [notifications, setNotifications] = useState({ messages: true, sounds: true, vibration: false, preview: true });
  const [privacy, setPrivacy] = useState({ lastSeen: "all", profilePhoto: "contacts", readReceipts: true, typing: true });
  const [profileName, setProfileName] = useState("Я 🌟");
  const [profileStatus, setProfileStatus] = useState("Всегда на связи ✨");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  const filteredChats = CHATS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages(prev => [...prev, { id: Date.now(), text: inputText, isMe: true, time, encrypted: true }]);
    setInputText("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: ["Круто! 😍", "Ха, это точно 😂", "Ок, поняла ✨", "Согласна!", "Ого, серьёзно? 🤔"][Math.floor(Math.random() * 5)],
        isMe: false,
        time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
        encrypted: true,
      }]);
    }, 1200);
  };

  const handleDeleteAccount = () => {
    if (deleteStep < 2) {
      setDeleteStep(s => s + 1);
    } else {
      setShowDeleteConfirm(false);
      setDeleteStep(0);
      alert("Аккаунт успешно удалён. До свидания! 👋");
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${value ? "bg-gradient-to-r from-violet-400 to-pink-400" : "bg-gray-200"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? "left-7" : "left-1"}`} />
    </button>
  );

  return (
    <div className="h-screen flex bg-background font-nunito overflow-hidden">
      {/* Декоративный фон */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-100 to-pink-100 rounded-full opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-sky-100 to-cyan-100 rounded-full opacity-40 blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Сайдбар */}
      <div className="relative z-10 w-80 flex flex-col sidebar-gradient border-r border-border/50">
        {/* Шапка */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-black">B</span>
              </div>
              <span className="text-xl font-black text-foreground tracking-tight">Bubble</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-xl hover:bg-white/60 transition flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Icon name="PenSquare" size={16} />
              </button>
            </div>
          </div>

          {activeTab === "chats" && (
            <div className="relative animate-fade-in">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск чатов..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/70 border border-border/50 text-sm outline-none focus:border-violet-300 focus:bg-white transition placeholder:text-muted-foreground"
              />
            </div>
          )}
        </div>

        {/* Список */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {activeTab === "chats" && (
            <div className="space-y-1">
              {filteredChats.map((chat, i) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 animate-fade-in text-left
                    ${activeChat?.id === chat.id ? "bg-white shadow-md shadow-violet-100/50" : "hover:bg-white/60"}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chat.color} flex items-center justify-center text-lg font-bold text-foreground/70`}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground truncate">{chat.name}</span>
                      <span className="text-xs text-muted-foreground ml-1 flex-shrink-0">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{chat.lastMsg}</span>
                      {chat.unread > 0 && (
                        <span className="ml-1 min-w-[20px] h-5 rounded-full bg-gradient-to-r from-violet-400 to-pink-400 text-white text-xs font-bold flex items-center justify-center px-1.5 flex-shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-1 pt-1">
              {CONTACTS.map((contact, i) => (
                <button
                  key={contact.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/60 transition-all animate-fade-in text-left"
                  onClick={() => {
                    const chat = CHATS.find(c => c.name.startsWith(contact.name.split(" ")[0]));
                    if (chat) { setActiveChat(chat); setActiveTab("chats"); }
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-base font-bold text-foreground/70`}>
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-foreground">{contact.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{contact.status}</div>
                  </div>
                  <div className="w-8 h-8 rounded-xl hover:bg-violet-100 flex items-center justify-center text-muted-foreground hover:text-violet-500 transition">
                    <Icon name="MessageCircle" size={15} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-1 pt-1">
              {(["profile", "privacy", "notifications", "deleteAccount"] as SettingsSection[]).map((sec) => {
                const icons: Record<SettingsSection, string> = { profile: "User", privacy: "Shield", notifications: "Bell", deleteAccount: "Trash2" };
                const labels: Record<SettingsSection, string> = { profile: "Профиль", privacy: "Приватность", notifications: "Уведомления", deleteAccount: "Удалить аккаунт" };
                const isDelete = sec === "deleteAccount";
                return (
                  <button
                    key={sec}
                    onClick={() => setSettingsSection(sec)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left
                      ${settingsSection === sec ? "bg-white shadow-md shadow-violet-100/50" : "hover:bg-white/60"}
                      ${isDelete ? "text-rose-400" : "text-foreground"}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDelete ? "bg-rose-50" : "bg-gradient-to-br from-violet-100 to-pink-100"}`}>
                      <Icon name={icons[sec]} size={16} className={isDelete ? "text-rose-400" : "text-violet-500"} />
                    </div>
                    <span className="font-semibold text-sm">{labels[sec]}</span>
                    {!isDelete && <Icon name="ChevronRight" size={14} className="ml-auto text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Нижняя навигация */}
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center justify-around bg-white/70 rounded-2xl p-1.5 shadow-sm">
            {(["chats", "contacts", "settings"] as Tab[]).map(tab => {
              const icons: Record<Tab, string> = { chats: "MessageCircle", contacts: "Users", settings: "Settings" };
              const labels: Record<Tab, string> = { chats: "Чаты", contacts: "Контакты", settings: "Настройки" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all
                    ${activeTab === tab
                      ? "bg-gradient-to-br from-violet-400 to-pink-400 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon name={icons[tab]} size={18} />
                  <span className="text-[10px] font-bold">{labels[tab]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* Открытый чат */}
        {activeTab === "chats" && activeChat && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="header-blur border-b border-border/40 px-6 py-4 flex items-center gap-4">
              <button onClick={() => setActiveChat(null)} className="w-9 h-9 rounded-xl hover:bg-white/80 flex items-center justify-center text-muted-foreground transition">
                <Icon name="ArrowLeft" size={18} />
              </button>
              <div className="relative">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${activeChat.color} flex items-center justify-center text-lg font-bold text-foreground/70`}>
                  {activeChat.avatar}
                </div>
                {activeChat.online && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />}
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground">{activeChat.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon name="Lock" size={10} className="text-violet-400" />
                  <span>Сквозное шифрование</span>
                  {activeChat.online && <span className="text-emerald-500 font-semibold">· онлайн</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 rounded-xl hover:bg-white/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition">
                  <Icon name="Phone" size={17} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-white/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition">
                  <Icon name="Video" size={17} />
                </button>
                <button className="w-9 h-9 rounded-xl hover:bg-white/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition">
                  <Icon name="MoreVertical" size={17} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              <div className="flex justify-center">
                <div className="flex items-center gap-1.5 bg-white/60 rounded-full px-4 py-1.5 text-xs text-muted-foreground shadow-sm">
                  <Icon name="Lock" size={11} className="text-violet-400" />
                  <span>Сообщения защищены сквозным шифрованием</span>
                </div>
              </div>

              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className={`flex animate-slide-up ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!msg.isMe && (
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeChat.color} flex items-center justify-center text-sm font-bold text-foreground/70 mr-2 flex-shrink-0 self-end`}>
                      {activeChat.avatar}
                    </div>
                  )}
                  <div className={`max-w-xs px-4 py-2.5 rounded-3xl shadow-sm ${msg.isMe
                    ? "msg-bubble-me rounded-br-lg text-foreground"
                    : "msg-bubble-them rounded-bl-lg text-foreground"}`}
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                      {msg.isMe && <Icon name="CheckCheck" size={12} className="text-violet-400 opacity-70" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 pb-4 pt-2">
              <div className="flex items-end gap-2 bg-white/80 rounded-3xl p-2 shadow-lg shadow-violet-100/30 border border-border/40">
                <button className="w-9 h-9 rounded-2xl hover:bg-violet-50 flex items-center justify-center text-muted-foreground hover:text-violet-400 transition flex-shrink-0">
                  <Icon name="Smile" size={20} />
                </button>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Написать сообщение..."
                  rows={1}
                  className="flex-1 bg-transparent outline-none resize-none text-sm font-medium placeholder:text-muted-foreground max-h-32 py-1.5 px-1"
                />
                <button className="w-9 h-9 rounded-2xl hover:bg-violet-50 flex items-center justify-center text-muted-foreground hover:text-violet-400 transition flex-shrink-0">
                  <Icon name="Paperclip" size={18} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 flex-shrink-0"
                >
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Пустое состояние чатов */}
        {activeTab === "chats" && !activeChat && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mb-6 shadow-xl shadow-violet-100">
              <span className="text-5xl">💬</span>
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Выбери чат</h2>
            <p className="text-muted-foreground font-medium text-center max-w-xs">Все сообщения защищены сквозным шифрованием 🔒</p>
          </div>
        )}

        {/* Контакты — пустое */}
        {activeTab === "contacts" && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center mb-6 shadow-xl shadow-sky-100">
              <span className="text-5xl">👥</span>
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Контакты</h2>
            <p className="text-muted-foreground font-medium">Выбери контакт слева для начала переписки</p>
          </div>
        )}

        {/* Настройки */}
        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">

            {settingsSection === "profile" && (
              <div className="max-w-lg mx-auto space-y-6">
                <h2 className="text-2xl font-black text-foreground">Мой профиль</h2>
                <div className="glass-card rounded-3xl p-6 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-300 to-pink-300 flex items-center justify-center text-4xl font-black text-white mx-auto mb-4 shadow-xl shadow-violet-200 cursor-pointer hover:scale-105 transition">
                    🌟
                  </div>
                  <button className="text-sm text-violet-500 font-semibold hover:text-violet-600 transition">Изменить фото</button>
                </div>
                <div className="glass-card rounded-3xl p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Имя</label>
                    <input
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full mt-1.5 px-4 py-3 rounded-2xl bg-white/70 border border-border/60 outline-none focus:border-violet-300 transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Статус</label>
                    <input
                      value={profileStatus}
                      onChange={e => setProfileStatus(e.target.value)}
                      className="w-full mt-1.5 px-4 py-3 rounded-2xl bg-white/70 border border-border/60 outline-none focus:border-violet-300 transition font-semibold"
                    />
                  </div>
                </div>
                <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-400 to-pink-400 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                  Сохранить изменения
                </button>
              </div>
            )}

            {settingsSection === "privacy" && (
              <div className="max-w-lg mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Приватность</h2>
                  <p className="text-muted-foreground font-medium text-sm mt-1">Все данные зашифрованы на твоём устройстве 🔐</p>
                </div>
                <div className="glass-card rounded-3xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                    <Icon name="Lock" size={20} className="text-violet-500" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Сквозное шифрование E2E</div>
                    <div className="text-xs text-muted-foreground">Никто кроме вас не читает сообщения</div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Включено</span>
                  </div>
                </div>
                <div className="glass-card rounded-3xl overflow-hidden divide-y divide-border/30">
                  {[
                    { label: "Последний визит", key: "lastSeen", options: ["all", "contacts", "nobody"], labels: ["Все", "Контакты", "Никто"] },
                    { label: "Фото профиля", key: "profilePhoto", options: ["all", "contacts", "nobody"], labels: ["Все", "Контакты", "Никто"] },
                  ].map(item => (
                    <div key={item.key} className="px-5 py-4">
                      <div className="font-semibold text-sm mb-2">{item.label}</div>
                      <div className="flex gap-2">
                        {item.options.map((opt, idx) => (
                          <button
                            key={opt}
                            onClick={() => setPrivacy(p => ({ ...p, [item.key]: opt }))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${privacy[item.key as keyof typeof privacy] === opt
                              ? "bg-gradient-to-r from-violet-400 to-pink-400 text-white shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-white"}`}
                          >
                            {item.labels[idx]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {[
                    { label: "Уведомления о прочтении", key: "readReceipts" },
                    { label: "Статус «печатает...»", key: "typing" },
                  ].map(item => (
                    <div key={item.key} className="px-5 py-4 flex items-center justify-between">
                      <span className="font-semibold text-sm">{item.label}</span>
                      <Toggle
                        value={privacy[item.key as keyof typeof privacy] as boolean}
                        onChange={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key as keyof typeof privacy] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settingsSection === "notifications" && (
              <div className="max-w-lg mx-auto space-y-6">
                <h2 className="text-2xl font-black text-foreground">Уведомления</h2>
                <div className="glass-card rounded-3xl overflow-hidden divide-y divide-border/30">
                  {[
                    { label: "Сообщения", desc: "Новые сообщения в чатах", key: "messages", icon: "MessageCircle" },
                    { label: "Звуки", desc: "Звуковые сигналы", key: "sounds", icon: "Volume2" },
                    { label: "Вибрация", desc: "Виброотклик на уведомления", key: "vibration", icon: "Vibrate" },
                    { label: "Предпросмотр", desc: "Текст в уведомлении", key: "preview", icon: "Eye" },
                  ].map(item => (
                    <div key={item.key} className="px-5 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} size={16} className="text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      <Toggle
                        value={notifications[item.key as keyof typeof notifications]}
                        onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settingsSection === "deleteAccount" && (
              <div className="max-w-lg mx-auto space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-rose-500">Удалить аккаунт</h2>
                  <p className="text-muted-foreground font-medium text-sm mt-1">Это действие необратимо</p>
                </div>
                <div className="glass-card rounded-3xl p-5 space-y-3 border border-rose-100">
                  <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-rose-400" />
                  </div>
                  <h3 className="font-black text-foreground text-lg">Что будет удалено:</h3>
                  {["Все твои сообщения и чаты", "Контакты и история переписки", "Настройки профиля и фото", "Медиафайлы и документы"].map(item => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="X" size={14} className="text-rose-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  Удалить мой аккаунт
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модалка удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-bounce-in">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">{deleteStep === 0 ? "⚠️" : deleteStep === 1 ? "🗑️" : "💔"}</div>
              <h3 className="text-xl font-black text-foreground">
                {deleteStep === 0 ? "Ты уверен?" : deleteStep === 1 ? "Последний шанс" : "Прощай..."}
              </h3>
              <p className="text-muted-foreground text-sm mt-2 font-medium">
                {deleteStep === 0
                  ? "Все твои данные будут безвозвратно удалены."
                  : deleteStep === 1
                  ? "Мы удалим абсолютно всё. Восстановление невозможно."
                  : "Нажми ещё раз, чтобы навсегда удалить аккаунт."}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                {deleteStep === 0 ? "Да, удалить" : deleteStep === 1 ? "Я понимаю, удалить" : "Удалить навсегда"}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteStep(0); }}
                className="w-full py-3 rounded-2xl bg-muted text-muted-foreground font-semibold hover:bg-white transition-all text-sm"
              >
                Отмена — остаться
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
