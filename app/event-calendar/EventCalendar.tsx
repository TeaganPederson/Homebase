'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  getDoc,
  type DocumentData,
  type CollectionReference,
  type Query,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { type User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import {
  FiCalendar,
  FiThumbsUp,
  FiPlus,
  FiLink,
  FiFilter,
} from 'react-icons/fi';

// Types for Event Data
interface Event {
  id: string;
  projectId: string;
  projectName: string;
  projectTicker: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
  eventType: string;
  link?: string;
  status: string;
  reactions: { likes: string[]; comments: { userId: string; text: string }[] };
}

interface DayEvents {
  events: Event[];
}

interface EventDay {
  day: string;
  date: string;
  events: DayEvents;
}

interface Project {
  id: string;
  name: string;
  ticker: string;
}

interface PendingProject {
  name: string;
  ticker: string;
  description: string;
  contractAddress: string;
  website: string;
  proofOfOwnership: string;
}

interface EventCalendarProps {
  user: User | null;
  followedProjects: string[];
}

function timestampToDateString(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toISOString().split('T')[0];
}

function getCurrentWeekDates(): { day: string; date: string; fullDate: string }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const days = [];
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    days.push({
      day: dayNames[i],
      date: currentDay.getUTCDate().toString(),
      fullDate: currentDay.toISOString().split('T')[0],
    });
  }
  console.log('weekDates:', days);
  return days;
}

const chunkArray = (array: string[], size: number) =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size)
  );

export default function EventCalendar({ user, followedProjects }: EventCalendarProps) {
  const [eventData, setEventData] = useState<EventDay[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitProjectModal, setShowSubmitProjectModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newEvent, setNewEvent] = useState({
    projectId: '',
    title: '',
    description: '',
    date: '',
    eventType: 'AMA',
    link: '',
  });
  const [newProject, setNewProject] = useState<PendingProject>({
    name: '',
    ticker: '',
    description: '',
    contractAddress: '',
    website: '',
    proofOfOwnership: '',
  });
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');

  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const querySnapshot = await getDocs(collection(db, 'tokenLaunch'));
        const projectList: Project[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Unknown',
          ticker: doc.data().ticker || 'N/A',
        }));
        console.log('Fetched projects for dropdown:', projectList);
        setProjects(projectList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchEventData();
  }, [user, followedProjects, eventTypeFilter]);

  async function fetchEventData() {
    setLoading(true);
    setError(null);
    try {
      const startDate = new Date(weekDates[0].fullDate + 'T00:00:00.000Z');
      const endDate = new Date(weekDates[6].fullDate + 'T23:59:59.999Z');
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      console.log('Querying events from:', startTimestamp.toDate().toISOString());
      console.log('Querying events to:', endTimestamp.toDate().toISOString());
      console.log('followedProjects:', followedProjects);
      console.log('eventTypeFilter:', eventTypeFilter);

      const projectMap: { [key: string]: { name: string; ticker: string } } = {};
      const projectCollection = collection(db, 'tokenLaunch') as CollectionReference<DocumentData>;
      let projectQuery: CollectionReference<DocumentData> | Query<DocumentData> = projectCollection;
      if (user && followedProjects.length > 0) {
        projectQuery = query(projectCollection, where('__name__', 'in', followedProjects));
      }
      const projectSnapshot = await getDocs(projectQuery);
      console.log('Fetched projects:', projectSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      projectSnapshot.forEach((doc) => {
        projectMap[doc.id] = {
          name: doc.data().name || 'Unknown',
          ticker: doc.data().ticker || 'N/A',
        };
      });

      const eventCollection = collection(db, 'projectEvents') as CollectionReference<DocumentData>;
      let querySnapshotDocs: DocumentData[] = [];

      if (user && followedProjects.length > 0) {
        const chunks = chunkArray(followedProjects, 30);
        for (const chunk of chunks) {
          const q = query(
            eventCollection,
            where('date', '>=', startTimestamp),
            where('date', '<=', endTimestamp),
            where('projectId', 'in', chunk),
            where('status', '==', 'approved')
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => querySnapshotDocs.push(doc));
        }
      } else {
        const q = query(
          eventCollection,
          where('date', '>=', startTimestamp),
          where('date', '<=', endTimestamp),
          where('status', '==', 'approved')
        );
        const snapshot = await getDocs(q);
        querySnapshotDocs = snapshot.docs;
      }

      console.log('Query snapshot size:', querySnapshotDocs.length);
      querySnapshotDocs.forEach((doc) => {
        console.log('Event:', doc.id, doc.data());
      });

      const fetchedData: { [key: string]: DayEvents } = {};
      for (const doc of querySnapshotDocs) {
        const data = doc.data();
        const eventDateString = timestampToDateString(data.date);
        console.log('Processing event:', doc.id, 'Date:', eventDateString);

        const event: Event = {
          id: doc.id,
          projectId: data.projectId,
          projectName: projectMap[data.projectId]?.name || 'Unknown',
          projectTicker: projectMap[data.projectId]?.ticker || 'N/A',
          title: data.title,
          description: data.description,
          date: eventDateString,
          createdBy: data.createdBy,
          eventType: data.eventType,
          link: data.link,
          status: data.status || 'unknown',
          reactions: data.reactions || { likes: [], comments: [] },
        };

        if (eventTypeFilter !== 'All' && event.eventType !== eventTypeFilter) {
          console.log('Event filtered out by eventType:', event.title, event.eventType);
          continue;
        }

        if (!fetchedData[eventDateString]) {
          fetchedData[eventDateString] = { events: [] };
        }
        fetchedData[eventDateString].events.push(event);
      }

      const newEventData = weekDates.map((dayInfo) => {
        console.log('Mapping day:', dayInfo.fullDate, 'Events:', fetchedData[dayInfo.fullDate]?.events || []);
        return {
          day: dayInfo.day,
          date: dayInfo.date,
          events: fetchedData[dayInfo.fullDate] || { events: [] },
        };
      });

      console.log('Final eventData:', JSON.stringify(newEventData, null, 2));
      setEventData([...newEventData]);

      if (newEventData.every((day) => day.events.events.length === 0)) {
        console.warn('No events found for this week.');
        setError(
          followedProjects.length > 0
            ? 'No approved events found for your followed projects this week.'
            : 'No approved events scheduled this week.'
        );
      }
    } catch (error: any) {
      console.error('Error fetching event data:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setError(`Failed to load event data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async (event: Event) => {
    if (!user) {
      alert('Please sign in to react!');
      return;
    }
    try {
      const eventRef = doc(db, 'projectEvents', event.id);
      const userId = user.uid;
      const isLiked = event.reactions.likes.includes(userId);
      await updateDoc(eventRef, {
        'reactions.likes': isLiked ? arrayRemove(userId) : arrayUnion(userId),
      });
      setEventData((prev) =>
        prev.map((day) => ({
          ...day,
          events: {
            events: day.events.events.map((e) =>
              e.id === event.id
                ? {
                    ...e,
                    reactions: {
                      ...e.reactions,
                      likes: isLiked
                        ? e.reactions.likes.filter((id) => id !== userId)
                        : [...e.reactions.likes, userId],
                    },
                  }
                : e
            ),
          },
        }))
      );
      if (selectedEvent?.id === event.id) {
        setSelectedEvent({
          ...selectedEvent,
          reactions: {
            ...selectedEvent.reactions,
            likes: isLiked
              ? selectedEvent.reactions.likes.filter((id) => id !== userId)
              : [...selectedEvent.reactions.likes, userId],
          },
        });
      }
    } catch (error) {
      console.error('Error liking event:', error);
    }
  };

  const handleCommentSubmit = async (event: Event) => {
    if (!user) {
      alert('Please sign in to comment!');
      return;
    }
    if (!comment.trim()) return;
    try {
      const eventRef = doc(db, 'projectEvents', event.id);
      const newComment = { userId: user.uid, text: comment };
      await updateDoc(eventRef, {
        'reactions.comments': arrayUnion(newComment),
      });
      setEventData((prev) =>
        prev.map((day) => ({
          ...day,
          events: {
            events: day.events.events.map((e) =>
              e.id === event.id
                ? {
                    ...e,
                    reactions: {
                      ...e.reactions,
                      comments: [...e.reactions.comments, newComment],
                    },
                  }
                : e
            ),
          },
        }))
      );
      if (selectedEvent?.id === event.id) {
        setSelectedEvent({
          ...selectedEvent,
          reactions: {
            ...selectedEvent.reactions,
            comments: [...selectedEvent.reactions.comments, newComment],
          },
        });
      }
      setComment('');
    } catch (error) {
      console.error('Error commenting on event:', error);
    }
  };

  const handleCreateEvent = async () => {
    if (!user) {
      alert('Please sign in to create an event!');
      return;
    }
    if (
      !newEvent.projectId ||
      !newEvent.title ||
      !newEvent.description ||
      !newEvent.date ||
      !newEvent.eventType
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const isAdmin = user.email === 'homebasemarkets@gmail.com';
      const eventData = {
        projectId: newEvent.projectId,
        title: newEvent.title,
        description: newEvent.description,
        date: Timestamp.fromDate(new Date(newEvent.date)),
        createdBy: user.uid,
        eventType: newEvent.eventType,
        link: newEvent.link || null,
        status: isAdmin ? 'approved' : 'pending',
        reactions: { likes: [], comments: [] },
      };
      console.log('Creating event:', eventData);
      const docRef = await addDoc(collection(db, 'projectEvents'), eventData);
      console.log('Event created with ID:', docRef.id);
      setShowCreateModal(false);
      setNewEvent({ projectId: '', title: '', description: '', date: '', eventType: 'AMA', link: '' });

      if (eventData.status === 'approved') {
        const projectDoc = await getDoc(doc(db, 'tokenLaunch', newEvent.projectId));
        if (projectDoc.exists()) {
          const projectData = projectDoc.data() as { name: string; followers?: string[] };
          console.log('Project data:', projectData);
          const followers = projectData.followers || [];
          if (Notification.permission === 'granted') {
            followers.forEach((followerId: string) => {
              if (followerId === user.uid) return;
              new Notification(`New Event for ${projectData.name}`, {
                body: `${newEvent.title} - ${newEvent.description.slice(0, 50)}...`,
              });
            });
          }
        }
      }

      fetchEventData();
    } catch (error: any) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error.message}`);
    }
  };

  const handleSubmitProject = async () => {
    if (!user) {
      alert('Please sign in to submit a project!');
      return;
    }
    if (
      !newProject.name ||
      !newProject.ticker ||
      !newProject.description ||
      !newProject.contractAddress ||
      !newProject.website ||
      !newProject.proofOfOwnership
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const projectData = {
        name: newProject.name,
        ticker: newProject.ticker,
        description: newProject.description,
        contractAddress: newProject.contractAddress,
        website: newProject.website,
        proofOfOwnership: newProject.proofOfOwnership,
        submitterId: user.uid,
        submittedAt: Timestamp.fromDate(new Date()),
        status: 'pending',
        adminNotes: '',
      };
      console.log('Submitting project:', projectData);
      const docRef = await addDoc(collection(db, 'pendingProjects'), projectData);
      console.log('Project submitted with ID:', docRef.id);
      setShowSubmitProjectModal(false);
      setNewProject({
        name: '',
        ticker: '',
        description: '',
        contractAddress: '',
        website: '',
        proofOfOwnership: '',
      });
      alert('Project submitted for review!');
    } catch (error: any) {
      console.error('Error submitting project:', error);
      alert(`Failed to submit project: ${error.message}`);
    }
  };

  return (
    <div className="my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-400 flex items-center gap-2">
          <FiCalendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
          Event Calendar
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="appearance-none px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
            >
              <option value="All">All Events</option>
              <option value="AMA">AMA</option>
              <option value="Giveaway">Giveaway</option>
              <option value="Update">Update</option>
              <option value="Other">Other</option>
            </select>
            <FiFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-200 w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          {(user?.email === 'homebasemarkets@gmail.com' || true) && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-500/20 text-gray-200 rounded-md hover:bg-blue-400/30 transition text-sm sm:text-base flex items-center gap-1"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Create Event
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowSubmitProjectModal(true)}
                className="px-4 py-2 bg-blue-500/20 text-gray-200 rounded-md hover:bg-blue-400/30 transition text-sm sm:text-base flex items-center gap-1"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Project
              </motion.button>
            </>
          )}
        </div>
      </div>
      <div className="bg-gray-950 p-6 sm:p-8 rounded-xl shadow-md border border-blue-500/20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-950 p-4 rounded-lg shadow-md border border-blue-500/20 min-h-80 flex flex-col animate-pulse"
              >
                <div className="h-6 bg-gray-900 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-900 rounded w-1/4 mx-auto mb-4"></div>
                <div className="flex-grow space-y-4">
                  <div className="bg-gray-900 p-3 rounded-md border border-blue-500/20">
                    <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto mb-2"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-950 p-2 rounded-md h-16 border border-blue-500/20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-6">
            <p>{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={fetchEventData}
              className="mt-2 text-blue-400 underline hover:text-blue-300 text-sm sm:text-base"
            >
              Retry
            </motion.button>
          </div>
        ) : eventData.every((day) => day.events.events.length === 0) ? (
          <div className="text-center text-gray-300 py-6">
            <p>No approved events scheduled for this week.</p>
            {followedProjects.length > 0 && (
              <p>Try clearing the project filter to see all events.</p>
            )}
            {eventTypeFilter !== 'All' && (
              <p>Try setting the event type filter to "All".</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
            {eventData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-gray-950 p-4 rounded-lg shadow-md border border-blue-500/20 min-h-80 flex flex-col"
              >
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-400">
                    {day.day}
                  </h2>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {day.date}
                  </p>
                </div>
                <div className="flex-grow mt-4">
                  <div className="bg-gray-900 p-3 rounded-md border border-blue-500/20 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-200 text-center mb-2 flex items-center justify-center gap-1">
                      <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-200" />
                      Events
                    </h3>
                    {day.events?.events?.length === 0 ? (
                      <p className="text-xs sm:text-sm text-gray-300 text-center">
                        No events scheduled
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {day.events.events.map((event, idx) => (
                          <motion.div
                            key={idx}
                            className="bg-gray-950 p-2 rounded-md shadow-sm hover:bg-gray-800 transition-all cursor-pointer border border-blue-500/20"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <p className="text-xs sm:text-sm font-semibold text-gray-200 truncate w-full text-center">
                              {event.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-300 text-center">
                              {event.projectName} ({event.projectTicker})
                            </p>
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-[10px] sm:text-xs rounded-full text-gray-200 ${
                                event.eventType === 'AMA'
                                  ? 'bg-blue-500/20'
                                  : event.eventType === 'Giveaway'
                                  ? 'bg-blue-400/20'
                                  : event.eventType === 'Update'
                                  ? 'bg-blue-300/20'
                                  : 'bg-gray-800'
                              }`}
                            >
                              {event.eventType}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-950/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-950 p-6 rounded-xl shadow-md w-full max-w-md sm:max-w-lg relative mx-4 my-8 border border-blue-500/20"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-gray-300 text-lg hover:text-gray-200"
            >
              ×
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-4">
              {selectedEvent.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
              <strong>Project:</strong> {selectedEvent.projectName} ({selectedEvent.projectTicker})
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
              <strong>Date:</strong> {selectedEvent.date}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-2">
              <strong>Type:</strong> {selectedEvent.eventType}
            </p>
            {selectedEvent.link && (
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                <strong>Link:</strong>{' '}
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FiLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  Join Event
                </a>
              </p>
            )}
            <p className="text-sm sm:text-base text-gray-300 mb-4 break-words">
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <div className="flex flex-wrap justify-between mb-4 gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleLike(selectedEvent)}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition ${
                  user && selectedEvent.reactions.likes.includes(user.uid)
                    ? 'bg-blue-500/20 text-gray-200 hover:bg-blue-400/30'
                    : 'bg-gray-900 text-gray-200 hover:bg-gray-800 border border-blue-500/20'
                }`}
              >
                <FiThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Like ({selectedEvent.reactions.likes.length})
              </motion.button>
            </div>
            <div className="mb-4">
              <h4 className="text-sm sm:text-base font-semibold text-gray-200 mb-2">
                Comments
              </h4>
              {selectedEvent.reactions.comments.length > 0 ? (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedEvent.reactions.comments.map((c, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-gray-300 border-b border-blue-500/20 pb-1 break-words"
                    >
                      <strong>User {c.userId.slice(0, 8)}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-gray-300">
                  No comments yet.
                </p>
              )}
              {user && (
                <div className="mt-2 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-1 rounded-md border border-blue-500/20 bg-gray-900 text-gray-200 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleCommentSubmit(selectedEvent)}
                    className="bg-blue-500/20 text-gray-200 px-3 py-1 rounded-md hover:bg-blue-400/30 transition text-sm sm:text-base"
                  >
                    Post
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-950/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-950 p-6 rounded-xl shadow-md w-full max-w-md sm:max-w-lg relative mx-4 my-8 border border-blue-500/20"
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-300 text-lg hover:text-gray-200"
            >
              ×
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-4">
              Create New Event
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Project
                </label>
                <select
                  value={newEvent.projectId}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, projectId: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.ticker})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="e.g., Community AMA"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Event Type
                </label>
                <select
                  value={newEvent.eventType}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, eventType: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AMA">AMA</option>
                  <option value="Giveaway">Giveaway</option>
                  <option value="Update">Update</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Describe the event..."
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base h-24 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  value={newEvent.link}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, link: e.target.value })
                  }
                  placeholder="e.g., Zoom or Discord link"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleCreateEvent}
                className="w-full bg-blue-500/20 text-gray-200 py-2 rounded-md hover:bg-blue-400/30 transition text-sm sm:text-base"
              >
                Create Event
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {showSubmitProjectModal && (
        <div className="fixed inset-0 bg-gray-950/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-950 p-6 rounded-xl shadow-md w-full max-w-md sm:max-w-lg relative mx-4 my-8 border border-blue-500/20"
          >
            <button
              onClick={() => setShowSubmitProjectModal(false)}
              className="absolute top-3 right-3 text-gray-300 text-lg hover:text-gray-200"
            >
              ×
            </button>
            <h3 className="text-lg sm:text-xl font-bold text-gray-200 mb-4">
              Submit New Project
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  placeholder="e.g., Homebase Project"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Ticker
                </label>
                <input
                  type="text"
                  value={newProject.ticker}
                  onChange={(e) =>
                    setNewProject({ ...newProject, ticker: e.target.value })
                  }
                  placeholder="e.g., HMB"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  placeholder="Describe your project..."
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base h-24 bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Contract Address
                </label>
                <input
                  type="text"
                  value={newProject.contractAddress}
                  onChange={(e) =>
                    setNewProject({ ...newProject, contractAddress: e.target.value })
                  }
                  placeholder="e.g., 0x..."
                                    className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Website
                </label>
                <input
                  type="url"
                  value={newProject.website}
                  onChange={(e) =>
                    setNewProject({ ...newProject, website: e.target.value })
                  }
                  placeholder="e.g., https://project.com"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Proof of Ownership
                </label>
                <input
                  type="text"
                  value={newProject.proofOfOwnership}
                  onChange={(e) =>
                    setNewProject({ ...newProject, proofOfOwnership: e.target.value })
                  }
                  placeholder="e.g., Link to verified contract or admin proof"
                  className="mt-1 w-full px-3 py-2 border border-blue-500/20 rounded-md text-sm sm:text-base bg-gray-900 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSubmitProject}
                className="w-full bg-blue-500/20 text-gray-200 py-2 rounded-md hover:bg-blue-400/30 transition text-sm sm:text-base"
              >
                Submit Project
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}