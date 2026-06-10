"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, CheckCircle, Loader2, Link as LinkIcon, Edit3, Globe, Sparkles, Clock, Plus, XCircle, MessageSquarePlus, User, Paperclip, FileJson, FileText, Copy, Calendar } from 'lucide-react';
import { useToast } from './ToastContext';
import { socket } from '@/lib/socket';

const OWNER_TEMPLATE = `[\n  {\n    "id": "",\n    "name": "",\n    "slug": "",\n    "short_description": "",\n    "description": "",\n    "use_case": "",\n    "key_features": [\n      "",\n      "",\n      ""\n    ],\n    "website_url": "",\n    "logo_url": "",\n    "cover_image_url": "",\n    "category_id": "",\n    "category_name": "",\n    "sub_category": "",\n    "micro_category": "",\n    "pricing_type": "",\n    "pricing_details": "",\n    "developer_name": "",\n    "developer_description": "",\n    "author_name": "",\n    "author_role": "",\n    "author_description": "",\n    "company_founded_year": "",\n    "launch_date": "",\n    "ai_model_used": "",\n    "platform_support": [\n      "Web"\n    ],\n    "api_available": false,\n    "github_url": "",\n    "integrations": [],\n    "monthly_visits": 0,\n    "rating": 0,\n    "review_count": 0,\n    "tool_status": "Active",\n    "featured": false,\n    "verified": false,\n    "tags": [],\n    "search_keywords": [],\n    "last_verified": "",\n    "created_at": "",\n    "updated_at": ""\n  }\n]`;

const MEMBER_TEMPLATE = `[\n  {\n    "name": "Example Tool",\n    "url": "https://example.com",\n    "description": "Short description"\n  }\n]`;

export const AddTools = () => {
  const { showToast } = useToast();
  const [currentRole, setCurrentRole] = useState<string>('user');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const local = new Date(today.getTime() - (offset * 60 * 1000));
    return local.toISOString().split('T')[0];
  });

  type MessageType = { id: number; sender: 'ai' | 'user'; text: string; modalTitle?: string; options?: { label: string, value: string }[]; snapshot?: any; toolsList?: any[] };
  const defaultMessages: MessageType[] = [
    {
      id: 1,
      sender: 'ai',
      text: `Welcome to ManMadhan'S Hub!\n\nPlease select your uploading date to proceed with the tool integration:`,
      modalTitle: `Select Date`,
      options: [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Custom Date", value: "custom" }
      ]
    }
  ];

  const [messages, setMessages] = useState<MessageType[]>(defaultMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<'date' | 'mode' | 'name' | 'url' | 'description' | 'confirm' | 'done'>('date');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [liveDuplicates, setLiveDuplicates] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bulkIndex, setBulkIndex] = useState(0);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [bulkTools, setBulkTools] = useState<any[]>([]);
  const [targetCount, setTargetCount] = useState(1);
  const [toolData, setToolData] = useState({ name: '', url: '', description: '' });
  const [addedHistory, setAddedHistory] = useState<{ name: string, url: string, description?: string, time: Date }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rawRole = localStorage.getItem('user_role') || 'user';
    setCurrentRole(rawRole.toLowerCase().includes('owner') ? 'owner' : 'member');

    const savedState = localStorage.getItem('manmadhan_chat_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setMessages(parsed.messages);
        setStep(parsed.step);
        setMode(parsed.mode);
        setBulkTools(parsed.bulkTools);
        setBulkIndex(parsed.bulkIndex);
        setTargetCount(parsed.targetCount);
        setToolData(parsed.toolData);
        setSelectedDate(parsed.selectedDate);
      } catch (e) { }
    }

    const username = localStorage.getItem('user_name') || 'anonymous';
    const historyKey = `manmadhan_addtools_history_${username}`;
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      try {
        setAddedHistory(JSON.parse(savedHistory));
      } catch (e) { }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const username = localStorage.getItem('user_name') || 'anonymous';
      const historyKey = `manmadhan_addtools_history_${username}`;
      localStorage.setItem('manmadhan_chat_state', JSON.stringify({
        messages, step, mode, bulkTools, bulkIndex, targetCount, toolData, selectedDate
      }));
      localStorage.setItem(historyKey, JSON.stringify(addedHistory));
    }
  }, [messages, step, mode, bulkTools, bulkIndex, targetCount, toolData, selectedDate, addedHistory, isInitialized]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (step !== 'name' || inputValue.trim().length < 2) {
      setLiveDuplicates([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?search=${encodeURIComponent(inputValue.trim())}`);
        if (res.ok) {
          const data = await res.json();
          const nameLower = inputValue.trim().toLowerCase();
          const exact = data.tools.find((t: any) => t.name.toLowerCase() === nameLower);
          const similar = data.tools.filter((t: any) => t.name.toLowerCase().includes(nameLower) || nameLower.includes(t.name.toLowerCase())).slice(0, 5);
          if (exact && !similar.find((t: any) => t.id === exact.id)) {
            similar.unshift(exact);
          }
          setLiveDuplicates(similar);
        }
      } catch (e) {
        setLiveDuplicates([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, step]);

  const activeOptionsMsg = messages.find(m => m.options && m.options.length > 0);

  const handleJsonData = (data: any[], currentSnapshot: any = null) => {
    if (!Array.isArray(data)) return;

    if (currentRole !== 'owner' && data.length > 3) {
      setMessages(prev => [
        ...prev.map(m => m.options ? { ...m, options: undefined } : m),
        { id: Date.now() + Math.random(), sender: 'ai', text: `⚠️ **Upload Limit Exceeded**\n\nMembers can only upload up to 3 tools at a time via JSON. Your file contains ${data.length} tools. Please upgrade to Owner or reduce the file size.` }
      ]);
      return;
    }

    const validTools = data.filter(t => t.name && (t.url || t.website));
    if (validTools.length === 0) {
      setMessages(prev => [
        ...prev.map(m => m.options ? { ...m, options: undefined } : m),
        { id: Date.now() + Math.random(), sender: 'ai', text: `❌ **Invalid Format**\n\nThe JSON must contain an array of tools with at least "name" and "url" fields.` }
      ]);
      return;
    }

    setMessages(prev => [
      ...prev.map(m => m.options ? { ...m, options: undefined } : m),
      { id: Date.now() + Math.random(), sender: 'ai', text: `🔄 **Processing ${validTools.length} Tools...**\n\nI am submitting them to the registry now.` }
    ]);

    submitBulkTools(validTools);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;

      let parsedJson = null;
      try {
        parsedJson = JSON.parse(content);
      } catch (e) { }

      if (parsedJson && Array.isArray(parsedJson)) {
        setMessages(prev => [...prev.map(m => m.options ? { ...m, options: undefined } : m), { id: Date.now() + Math.random(), sender: 'user', text: `Uploaded file: ${file.name}` }]);
        handleJsonData(parsedJson);
      } else if (file.name.endsWith('.json')) {
        setMessages(prev => [...prev.map(m => m.options ? { ...m, options: undefined } : m), { id: Date.now() + Math.random(), sender: 'user', text: `Uploaded ${file.name}` }, { id: Date.now() + Math.random() + 1, sender: 'ai', text: `❌ Failed to parse JSON file. Ensure the file is a valid JSON array of tools.` }]);
      } else {
        setMessages(prev => [...prev.map(m => m.options ? { ...m, options: undefined } : m), { id: Date.now() + Math.random(), sender: 'user', text: `Uploaded ${file.name}` }, { id: Date.now() + Math.random() + 1, sender: 'ai', text: `⚠️ I checked the contents of ${file.name} but it does not contain valid JSON array data. Currently, only JSON format is supported.` }]);
      }
    };
    reader.readAsText(file);
    setShowUploadMenu(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processUserInput = async (userText: string) => {
    const currentSnapshot = { step, mode, bulkTools, targetCount, bulkIndex, toolData, selectedDate };

    const knownLabels: Record<string, string> = {
      '1': 'Add 1 Tool',
      '3': 'Bulk Add (3 Tools)',
      'upload_json': 'Upload JSON / TXT Data',
      'change_name': 'Change Name',
      'proceed_dup': "Proceed Anyway (It's New)",
      'restart': 'Add More Tools / Restart'
    };
    const displayText = knownLabels[userText] || userText;

    setMessages(prev => [
      ...prev.map(m => m.options ? { ...m, options: undefined } : m),
      { id: Date.now() + Math.random(), sender: 'user', text: displayText, snapshot: currentSnapshot }
    ]);
    setIsTyping(true);

    try {
      const parsed = JSON.parse(userText);
      if (Array.isArray(parsed)) {
        setIsTyping(false);
        handleJsonData(parsed, currentSnapshot);
        return;
      }
    } catch (e) { }

    setTimeout(async () => {
      setIsTyping(false);

      if (step === 'date') {
        const txt = userText.toLowerCase();

        if (txt === 'custom') {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Please type the specific uploading date in YYYY-MM-DD format:`
          }]);
          return;
        }

        let dStr = '';
        if (txt === 'yesterday' || txt.includes('yesterday')) {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          dStr = d.toISOString().split('T')[0];
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
          dStr = txt;
        } else if (txt === 'today' || txt.includes('today')) {
          const d = new Date();
          dStr = d.toISOString().split('T')[0];
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Invalid format detected. Enter the date using YYYY-MM-DD format or select an option:`
          }]);
          return;
        }
        setSelectedDate(dStr);
        setStep('mode');
        
        if (currentRole === 'owner') {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Uploading for **${dStr}**.\n\nAs an Owner, you must upload your tools registry via JSON.`,
            options: [
              { label: "Upload JSON / TXT Data", value: "upload_json" }
            ]
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Uploading for **${dStr}**.\n\nHow many tools would you like to integrate today? You can also upload a data file directly.`,
            options: [
              { label: "Add 1 Tool", value: "1" },
              { label: "Bulk Add (3 Tools)", value: "3" },
              { label: "Upload JSON / TXT Data", value: "upload_json" }
            ]
          }]);
        }
      }
      else if (step === 'mode') {
        const txt = userText.toLowerCase();
        if (currentRole === 'owner' && txt !== 'upload_json') {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: "Owners can only add tools via JSON upload.",
            options: [
              { label: "Upload JSON / TXT Data", value: "upload_json" }
            ]
          }]);
          return;
        }
        if (txt.includes('3') || txt.includes('bulk')) {
          setMode('bulk');
          setTargetCount(3);
          setStep('name');
          setBulkIndex(0);
          setBulkTools([{}, {}, {}]);
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: "Awesome! Let's add 3 tools in bulk. First, what is the name of Tool 1?" }]);
        } else if (txt.includes('1') || txt.includes('one') || txt.includes('single')) {
          setMode('single');
          setTargetCount(1);
          setStep('name');
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: "Great! What is the name of the tool you'd like to add?" }]);
        } else if (txt === 'upload_json') {
          const template = currentRole === 'owner' ? OWNER_TEMPLATE : MEMBER_TEMPLATE;
          
          setMessages(prev => [...prev, { 
            id: Date.now() + Math.random(), 
            sender: 'ai', 
            text: `You can upload your files using the 📎 **Paperclip icon** on the left of the input bar, or simply type/paste your JSON directly into the chat.\n\nHere is the required template you can copy and use:\n\n\`\`\`json\n${template}\n\`\`\`` 
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: "Please select an option below:",
            options: [
              { label: "Add 1 Tool", value: "1" },
              { label: "Bulk Add (3 Tools)", value: "3" },
              { label: "Upload JSON / TXT Data", value: "upload_json" }
            ]
          }]);
        }
      }
      else if (step === 'name') {
        const currentName = userText.trim();

        if (currentName.length < 2) {
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: "Please enter a valid, real name for the tool (at least 2 characters long)." }]);
          setIsTyping(false);
          return;
        }
        
        if (mode === 'bulk') {
          const newTools = [...bulkTools];
          newTools[bulkIndex] = { ...newTools[bulkIndex], name: currentName };
          setBulkTools(newTools);
          if (bulkIndex + 1 < targetCount) {
            setBulkIndex(bulkIndex + 1);
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Got it. What is the name of Tool ${bulkIndex + 2}?` }]);
          } else {
            setBulkIndex(0);
            setStep('url');
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Perfect! Now, what is the website URL for Tool 1 (${newTools[0].name})?` }]);
          }
        } else {
          setToolData(prev => ({ ...prev, name: currentName }));
          setStep('url');
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Got it. "${currentName}" sounds great. What is the website URL?` }]);
        }
      }
      else if (step === 'url') {
        let currentUrl = userText.trim();

        const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
        if (!urlPattern.test(currentUrl)) {
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: "Please provide a valid, neatly formatted URL (e.g., www.example.com or https://example.com)." }]);
          setIsTyping(false);
          return;
        }

        if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
          currentUrl = 'https://' + currentUrl;
        }

        setIsTyping(true);
        try {
          // Perform a general search to see if any tool has this URL
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools?search=${encodeURIComponent(currentUrl)}`);
          if (res.ok) {
            const data = await res.json();
            const urlLower = currentUrl.toLowerCase().trim();
            // Strict match check for URL
            const urlExists = data.tools.find((t: any) => 
              t.url?.toLowerCase().trim() === urlLower || 
              t.website_url?.toLowerCase().trim() === urlLower ||
              t.website?.toLowerCase().trim() === urlLower
            );
            
            if (urlExists) {
              setIsTyping(false);
              setMessages(prev => [...prev, { 
                id: Date.now() + Math.random(), 
                sender: 'ai', 
                text: `⛔ **URL Blocked!**\n\nThe URL "${currentUrl}" is already registered by the tool **${urlExists.name}**.\n\nYou cannot add duplicate URLs. Please provide a different URL for your tool.`
              }]);
              return;
            }
          }
        } catch { }
        setIsTyping(false);

        if (mode === 'bulk') {
          const newTools = [...bulkTools];
          newTools[bulkIndex] = { ...newTools[bulkIndex], url: currentUrl };
          setBulkTools(newTools);
          if (bulkIndex + 1 < targetCount) {
            setBulkIndex(bulkIndex + 1);
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Got it. What is the website URL for Tool ${bulkIndex + 2} (${newTools[bulkIndex + 1].name})?` }]);
          } else {
            setBulkIndex(0);
            setStep('description');
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Excellent. Finally, provide a brief description for Tool 1 (${newTools[0].name}).` }]);
          }
        } else {
          setToolData(prev => ({ ...prev, url: currentUrl }));
          setStep('description');
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Thanks! Now, provide a brief description of what ${toolData.name} does.` }]);
        }
      }
      else if (step === 'description') {
        if (mode === 'bulk') {
          const newTools = [...bulkTools];
          newTools[bulkIndex] = { ...newTools[bulkIndex], description: userText };
          setBulkTools(newTools);
          if (bulkIndex + 1 < targetCount) {
            setBulkIndex(bulkIndex + 1);
            setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: `Thanks! What is the description for Tool ${bulkIndex + 2} (${newTools[bulkIndex + 1].name})?` }]);
          } else {
            setStep('confirm');
            let summaryText = `Perfect! Here are the ${targetCount} tools you want to submit:\n\n`;
            newTools.forEach((t, i) => {
              summaryText += `**${i + 1}. ${t.name}**\nURL: ${t.url}\nDesc: ${t.description}\n\n`;
            });
            summaryText += `Do you want to confirm and submit these tools?`;
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(), sender: 'ai', text: summaryText,
              options: [{ label: "Yes, submit all", value: "yes" }, { label: "Edit Tools", value: "edit" }]
            }]);
          }
        } else {
          setToolData(prev => ({ ...prev, description: userText }));
          setStep('confirm');
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Perfect! Here's what I have for your tool:\n\n**URL:** ${toolData.url}\n\n**Description:** ${userText}\n\n**Name:** ${toolData.name}\n\nDo you want to confirm and submit this tool?`,
            options: [
              { label: "Yes, submit it", value: "yes" },
              { label: "Edit Tool", value: "edit" }
            ]
          }]);
        }
      }
      else if (step === 'confirm') {
        if (userText.toLowerCase() === 'restart' || userText.toLowerCase() === 'edit') {
          setStep('name');
          setBulkIndex(0);
          setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'ai', text: "Let's edit. What should the Name be?" }]);
        } else if (userText.toLowerCase() === 'yes' || userText.toLowerCase() === 'y' || userText.toLowerCase().includes('submit')) {
          if (mode === 'bulk') {
            await submitBulkTools(bulkTools);
          } else {
            const finalTool = { ...toolData, description: toolData.description || userText };
            await submitTool(finalTool);
          }
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Please confirm using the buttons below.`,
            options: [
              { label: "Yes, submit it", value: "yes" },
              { label: "Edit Tool", value: "edit" }
            ]
          }]);
        }
      }
      else if (step === 'done') {
        if (userText.toLowerCase() === 'restart' || userText.toLowerCase() === 'yes' || userText.toLowerCase() === 'add another') {
          setToolData({ name: '', url: '', description: '' });
          setBulkTools([]);
          setStep('mode');
          if (currentRole === 'owner') {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              sender: 'ai',
              text: "Awesome! Let's upload more tools.",
              options: [
                { label: "Upload JSON / TXT Data", value: "upload_json" }
              ]
            }]);
          } else {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              sender: 'ai',
              text: "Awesome! Let's add more. How would you like to integrate tools today?",
              options: [
                { label: "Add 1 Tool", value: "1" },
                { label: "Bulk Add (3 Tools)", value: "3" }
              ]
            }]);
          }
        } else {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            sender: 'ai',
            text: `Click below to add more tools.`,
            options: [{ label: "Add More Tools", value: "restart" }]
          }]);
        }
      }
    }, 600);
  };

  const submitBulkTools = async (toolsToSubmit: any[]) => {
    setIsTyping(true);
    let successCount = 0;
    let newHist = [...addedHistory];

    if (currentRole === 'owner') {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tools/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
          body: JSON.stringify({ tools: toolsToSubmit })
        });
        if (response.ok) {
          const result = await response.json();
          successCount = result.results?.success || toolsToSubmit.length;
          const added = toolsToSubmit.map(t => ({ name: t.name, url: t.url || t.website_url || t.website, description: t.description, time: new Date() }));
          newHist = [...added, ...newHist];
        }
      } catch (e) { console.error(e); }
    } else {
      for (const data of toolsToSubmit) {
        try {
          const targetUrl = data.url || data.website || '';
          const payload = {
            name: data.name,
            website_url: targetUrl,
            url: targetUrl,
            short_description: data.description || '',
            description: data.description || '',
            category_id: 'default',
            category_name: 'AI System',
            source: 'user',
            created_at: selectedDate
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            successCount++;
            newHist = [{ name: data.name, url: targetUrl, description: data.description, time: new Date() }, ...newHist];
          }
        } catch (e) { console.error(e); }
      }
    }

    setAddedHistory(newHist);
    setIsTyping(false);

    setStep('done');
    const successMsg = currentRole === 'owner'
      ? "Tools integrated directly into the global registry successfully!"
      : "Your tools have been securely sent to the Owners for moderation and review. Thank you!";

    let historyText = `\n\n**Session Upload History:**\n`;
    newHist.slice(0, toolsToSubmit.length).forEach((t, i) => {
      historyText += `${i + 1}. ${t.name} (${t.url})\n`;
    });

    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(), sender: 'ai',
      text: `✅ ${successCount}/${toolsToSubmit.length} tools submitted! ${successMsg}${historyText}`,
      options: [{ label: "Add More Tools", value: "restart" }]
    }]);
    showToast('Integration sequence complete!', 'success');

    // Broadcast real-time + push notification to all users
    if (successCount > 0) {
      const firstToolName = toolsToSubmit[0]?.name || 'New Tool';
      const notifTitle = `🚀 New AI Tool Added`;
      const notifDesc = successCount === 1
        ? `"${firstToolName}" has been added to the Global Registry.`
        : `${successCount} new tools have been added to the Global Registry.`;
      socket.emit('client_trigger_notification', {
        title: notifTitle,
        desc: notifDesc,
        type: 'tool_added',
        roles: ['owner', 'member']
      });
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setInputValue('');
    processUserInput(text);
  };

  const handleOptionSelect = (value: string, msgId: number) => {

    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, options: undefined } : m));
    processUserInput(value);
  };

  const submitTool = async (data: any) => {
    setIsTyping(true);
    try {
      const payload = {
        name: data.name,
        website_url: data.url,
        url: data.url,
        short_description: data.description,
        description: data.description,
        category_id: 'default', // Using a default category or handled backend
        category_name: 'AI System',
        source: currentRole === 'owner' ? 'manual' : 'user',
        created_at: selectedDate
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/user-tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('session_token')}` },
        body: JSON.stringify(payload)
      });

      setIsTyping(false);

      if (response.ok) {
        const newHistory = [{ name: data.name, url: data.url, description: data.description, time: new Date() }, ...addedHistory];
        setAddedHistory(newHistory);

        setStep('done');
        const successMsg = currentRole === 'owner'
          ? "Tools integrated directly into the global registry successfully!"
          : "Your tools have been securely sent to the Owners for moderation and review. Thank you!";

        let historyText = `\n\n**Session Upload History:**\n`;
        newHistory.slice(0, 1).forEach((t, i) => {
          historyText += `${i + 1}. ${t.name} (${t.url})\n`;
        });

        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          sender: 'ai',
          text: `✅ Tool submitted! ${successMsg}${historyText}`,
          options: [{ label: "Add More Tools", value: "restart" }]
        }]);
        showToast('Integration sequence complete!', 'success');

        // Broadcast push notification to all users (including offline)
        socket.emit('client_trigger_notification', {
          title: '🚀 New AI Tool Added',
          desc: `"${data.name}" has been added to the Global Registry.`,
          type: 'tool_added',
          roles: ['owner', 'member']
        });

      } else {
        const err = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          sender: 'ai',
          text: `❌ Error: ${err.message || 'Validation failed.'}. Let's try again for this tool.`,
          options: [{ label: "Try Again", value: "restart" }]
        }]);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        sender: 'ai',
        text: `❌ Connection failed. Let's try again.`,
        options: [{ label: "Try Again", value: "restart" }]
      }]);
    }
  };

  const editMessage = (msgId: number) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    const msg = messages[msgIndex];
    if (msg.sender !== 'user' || !msg.snapshot) return;

    const newMessages = messages.slice(0, msgIndex);
    const snap = msg.snapshot;

    setStep(snap.step);
    setMode(snap.mode);
    setBulkTools(snap.bulkTools);
    setTargetCount(snap.targetCount);
    setBulkIndex(snap.bulkIndex);
    setToolData(snap.toolData);
    if (snap.selectedDate) setSelectedDate(snap.selectedDate);

    setInputValue(msg.text);
    setMessages(newMessages);
    setIsTyping(false);
  };

  return (
    <div className="flex-1 w-full flex flex-col font-sans overflow-hidden min-h-0" onClick={() => setShowUploadMenu(false)}>
          {/* ── SMALL NEAT HEADER ──────────────────────────────────────── */}
          <div className="flex-none mb-4 flex flex-row items-center justify-between border-b border-[var(--border)] pb-4 px-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0f172a] border border-[#1e3a8a] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] overflow-hidden">
            <img src="/favicon.ico" alt="AI" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-[var(--text)] leading-none tracking-wide">Tools Registry</h1>
            <p className="text-[10px] text-[#3b82f6] mt-1 font-mono uppercase tracking-widest font-bold">Integration Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => {
            localStorage.removeItem('manmadhan_chat_state');
            setMessages(defaultMessages);
            setStep('date');
            setMode('single');
            setBulkTools([]);
            setBulkIndex(0);
            setToolData({ name: '', url: '', description: '' });
            setLiveDuplicates([]);
          }} title="New Chat" className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1e293b] text-white hover:bg-[#334155] transition shadow-sm">
            <MessageSquarePlus size={16} />
          </button>
          <button onClick={() => setShowHistoryModal(true)} title="History" className="flex items-center justify-center w-9 h-9 rounded-full bg-transparent border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 transition shadow-sm">
            <Clock size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden relative min-h-0">
        <div className="flex-1 flex flex-col relative min-h-0">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex flex-col gap-3"
                >
                  <div className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-[#1e3a8a] flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.15)] overflow-hidden">
                        <img src="/favicon.ico" alt="AI" className="w-6 h-6 object-contain" />
                      </div>
                    )}

                    <div className={`group relative max-w-[80%] rounded-2xl p-4 text-[13px] md:text-sm font-medium leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                      ? 'bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white rounded-tr-sm shadow-[0_4px_15px_rgba(59,130,246,0.25)]'
                      : 'bg-[#1e293b] border border-[#334155] text-[#f8fafc] rounded-tl-sm shadow-sm'
                      }`}>
                      {msg.text.split(/(```[\s\S]*?```)/).map((block, i) => {
                        if (block.startsWith('```') && block.endsWith('```')) {
                          const langMatch = block.match(/^```([a-z]*)/i);
                          const lang = langMatch ? langMatch[1] : '';
                          const content = block.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
                          
                          return (
                            <div key={i} className="my-4 relative group/code w-full">
                              <div className="flex justify-between items-center bg-[#1e293b] px-3 py-2 rounded-t-xl border border-b-0 border-[var(--border)]">
                                <span className="text-[10px] text-[var(--muted)] font-mono uppercase">{lang || 'CODE'}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(content.trim());
                                    showToast('Copied to clipboard!', 'success');
                                  }}
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--muted)] hover:text-white transition-colors"
                                  title="Copy to clipboard"
                                >
                                  <Copy size={12} />
                                  <span>COPY</span>
                                </button>
                              </div>
                              <pre className="bg-[#0f172a] text-[#e2e8f0] p-4 rounded-b-xl overflow-x-auto text-[12px] font-mono border border-[var(--border)] leading-relaxed m-0 shadow-inner">
                                <code>{content.trim()}</code>
                              </pre>
                            </div>
                          );
                        }
                        
                        return (
                          <span key={i}>
                            {block.split(/(\*\*.*?\*\*)/).map((part, j) => 
                              part.startsWith('**') && part.endsWith('**') 
                                ? <strong key={`${i}-${j}`} className="text-white">{part.slice(2, -2)}</strong> 
                                : <span key={`${i}-${j}`}>{part}</span>
                            )}
                          </span>
                        );
                      })}

                      {msg.options && msg.options.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {msg.options.map((opt, idx) => (
                            <button
                              key={opt.value}
                              onClick={() => handleOptionSelect(opt.value, msg.id)}
                              disabled={isTyping}
                              className="w-full flex items-center gap-3 p-3 mt-1 rounded-xl bg-[#1e293b] border border-[#334155] hover:border-[#3b82f6]/50 hover:bg-[#283548] transition-all group text-left disabled:opacity-50 shadow-sm"
                            >
                              <div className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-mono font-bold transition-all shrink-0 border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#3b82f6] group-hover:bg-[#3b82f6]/20 group-hover:border-[#3b82f6]/70">
                                {idx + 1}
                              </div>
                              <span className="text-[13px] font-semibold text-white transition-colors">{opt.label}</span>
                            </button>
                          ))}
                          {msg.text.includes("confirm") && (
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => handleOptionSelect('restart', msg.id)}
                                className="px-4 py-2 rounded-lg bg-[var(--bg3)] text-[var(--muted)] text-[11px] font-bold hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors uppercase tracking-wider"
                              >
                                Skip
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.toolsList && msg.toolsList.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.toolsList.map((t: any) => (
                            <div key={t.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 flex flex-col shadow-sm">
                              <div className="flex items-center gap-2">
                                <img src={`https://www.google.com/s2/favicons?domain=${t.url}&sz=32`} className="w-4 h-4 rounded-sm bg-white" alt="favicon" />
                                <span className="font-bold text-[var(--text)]">{t.name}</span>
                              </div>
                              <a href={t.url} target="_blank" rel="noreferrer" className="text-[11px] text-[#3b82f6] hover:underline mt-1 truncate ml-6">{t.url}</a>
                              {t.short_description && <span className="text-[11px] text-[var(--muted2)] mt-1.5 line-clamp-2 ml-6">{t.short_description}</span>}
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.sender === 'user' && msg.snapshot && (
                        <button
                          onClick={() => editMessage(msg.id)}
                          className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 rounded-full bg-[var(--bg3)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-all shadow-sm"
                          title="Edit this message"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <User size={16} className="text-[var(--muted)]" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-[#1e3a8a] flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.15)] overflow-hidden">
                  <img src="/favicon.ico" alt="AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-[var(--bg3)]/80 border border-[var(--border)] rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 h-[52px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative p-4 shrink-0 z-10">

            {/* Live Duplicates Warning */}
            <AnimatePresence>
              {liveDuplicates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-3 left-0 right-0 max-w-6xl mx-auto bg-red-500/10 border border-red-500/20 backdrop-blur-md rounded-2xl p-4 shadow-xl z-10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h4 className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Similar Tools Found in Registry</h4>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    {liveDuplicates.map(dup => (
                      <div key={dup.id} className="flex flex-col bg-[var(--bg)] border border-red-500/30 rounded-xl p-3 min-w-[200px] shadow-sm">
                        <span className="text-[13px] font-bold text-[var(--text)]">{dup.name}</span>
                        <a href={dup.url} target="_blank" rel="noreferrer" className="text-[10px] text-[var(--neon)] hover:underline truncate mt-1">{dup.url}</a>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative w-full max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>
              <input type="file" ref={fileInputRef} accept=".json,.txt,.csv,.xlsx" className="hidden" onChange={handleFileUpload} />
              <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-20">
                <button
                  onClick={() => setShowUploadMenu(!showUploadMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showUploadMenu ? 'bg-[#3b82f6]/20 text-[#3b82f6]' : 'hover:bg-white/5 text-[var(--muted2)] hover:text-white'}`}
                  title="Upload File"
                >
                  <Paperclip size={18} />
                </button>
                <AnimatePresence>
                  {showUploadMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-4 w-72 bg-[#1e293b] border border-[#3b82f6]/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-2 z-30"
                    >
                      <div className="px-3 py-2 text-xs font-bold text-[#3b82f6] border-b border-[#334155]/50 mb-2 uppercase tracking-widest">
                        Upload Data
                      </div>
                      <div className="px-3 pb-3 text-[12px] text-[var(--muted)] leading-relaxed">
                        You can upload <span className="text-white font-medium">.txt, .json, .xlsx,</span> and <span className="text-white font-medium">.csv</span> files.
                      </div>

                      <div className="space-y-1">
                        <button onClick={() => { setShowUploadMenu(false); fileInputRef.current?.click(); }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-[#3b82f6]/10 border border-transparent hover:border-[#3b82f6]/30 flex flex-col gap-1 transition-all group">
                          <div className="flex items-center gap-2 text-[13px] text-white font-semibold group-hover:text-[#3b82f6]">
                            <FileJson size={16} />
                            JSON Upload
                          </div>
                          <div className="pl-6 text-[11px] text-[var(--muted2)]">
                            {currentRole === 'owner'
                              ? 'Owner template will be updated later'
                              : 'Use the standard tools JSON format'}
                          </div>
                        </button>

                        <button onClick={() => { 
                          setShowUploadMenu(false); 
                          const template = currentRole === 'owner' ? OWNER_TEMPLATE : MEMBER_TEMPLATE;
                          setMessages(prev => [...prev, { 
                            id: Date.now() + Math.random(), 
                            sender: 'ai', 
                            text: `Please paste your JSON directly into the chat box below.\n\nHere is the required template you can copy and use:\n\n\`\`\`json\n${template}\n\`\`\`` 
                          }]);
                        }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 flex flex-col gap-1 transition-all group">
                          <div className="flex items-center gap-2 text-[13px] text-[var(--muted)] group-hover:text-white">
                            <Edit3 size={16} />
                            Type / Paste JSON
                          </div>
                          <div className="pl-6 text-[11px] text-[var(--muted2)]">
                            Open modal to paste JSON array
                          </div>
                        </button>
                        <button onClick={() => { setShowUploadMenu(false); fileInputRef.current?.click(); }} className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 flex flex-col gap-1 transition-all group">
                          <div className="flex items-center gap-2 text-[13px] text-[var(--muted)] group-hover:text-white">
                            <FileText size={16} />
                            Document Upload
                          </div>
                          <div className="pl-6 text-[11px] text-[var(--muted2)]">
                            TXT, CSV, XLSX formats
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => setShowUploadMenu(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const isExactDuplicate = step === 'name' && liveDuplicates.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase());
                    if (!isExactDuplicate) {
                      handleSend();
                    }
                  }
                }}
                disabled={isTyping || step === 'done'}
                placeholder={
                  step === 'date' ? "Enter a date..." :
                    step === 'name' ? "Enter tool name..." :
                      step === 'url' ? "Enter website URL (https://...)" :
                        step === 'description' ? "Describe what this tool does..." :
                          "Type your message..."
                }
                className="w-full h-[60px] pl-14 pr-16 rounded-2xl bg-[#1e293b] border border-[#334155] text-sm font-medium text-[var(--text)] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 disabled:opacity-50 transition-all shadow-lg"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || step === 'done' || (step === 'name' && liveDuplicates.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()))}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[18px] text-white flex items-center justify-center transition-all shadow-lg ${(step === 'name' && liveDuplicates.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()))
                  ? 'bg-red-500/20 text-red-500 cursor-not-allowed opacity-100 disabled:opacity-100 disabled:bg-red-500/20'
                  : 'bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-30 disabled:bg-white/5'
                  }`}
              >
                {(step === 'name' && liveDuplicates.some(t => t.name.toLowerCase() === inputValue.trim().toLowerCase()))
                  ? <XCircle size={18} />
                  : <Send size={16} className="-ml-0.5" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg3)]/30">
                <h3 className="font-bold text-[var(--text)]">Session Upload History</h3>
                <button onClick={() => setShowHistoryModal(false)} className="text-[var(--muted)] hover:text-[var(--text)]">&times;</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {addedHistory.length === 0 ? (
                  <p className="text-center text-[var(--muted)] text-sm py-8">No tools added in this session yet.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(
                      addedHistory.reduce((acc, item) => {
                        const dateStr = new Date(item.time).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
                        if (!acc[dateStr]) acc[dateStr] = [];
                        acc[dateStr].push(item);
                        return acc;
                      }, {} as Record<string, typeof addedHistory>)
                    ).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([dateStr, items]) => (
                      <div key={dateStr} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 sticky top-0 bg-[var(--bg)]/95 backdrop-blur-sm z-10">
                          <Calendar className="w-3.5 h-3.5 text-[var(--neon)]" />
                          <h4 className="text-[11px] font-bold text-[var(--text)] uppercase tracking-widest">{dateStr}</h4>
                        </div>
                        <div className="space-y-3">
                          {items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).map((item, idx) => (
                            <div key={idx} className="bg-[var(--bg3)]/50 border border-[var(--border)] rounded-xl p-3 flex flex-col hover:border-[var(--neon)]/30 transition-colors">
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-bold text-[var(--text)] text-[13px]">{item.name}</div>
                                <div className="text-[9px] text-[var(--muted)] font-mono flex items-center gap-1 shrink-0">
                                  <Clock className="w-2.5 h-2.5" />
                                  {new Date(item.time).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })}
                                </div>
                              </div>
                              <a href={item.url} target="_blank" rel="noreferrer" className="text-[11px] text-[var(--neon)] hover:underline break-all block mt-0.5">{item.url}</a>
                              {item.description && <div className="text-[11px] text-[var(--muted)] mt-2 line-clamp-2 bg-[var(--bg)] p-2 rounded-lg border border-[var(--border)]">{item.description}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-[var(--border)] flex justify-end">
                <button onClick={() => {
                  setAddedHistory([]);
                }} className="text-xs px-4 py-2 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition">Clear History</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
