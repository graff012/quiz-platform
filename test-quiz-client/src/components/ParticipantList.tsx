import Card from './Card';
import { Participant } from '@/types';

interface ParticipantListProps {
  participants: Participant[];
  maxCapacity?: number;
  className?: string;
}

const ParticipantList = ({ participants, maxCapacity = 20, className = '' }: ParticipantListProps) => {
  return (
    <Card className={className}>
      <h3 className="text-xl font-bold text-white mb-4">
        O'quvchilar {participants.length}/{maxCapacity}
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {participants.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Hali hech kim qo'shilmadi</p>
        ) : (
          participants.map((participant, index) => {
            const displayName = participant.user 
              ? `${participant.user.firstName} ${participant.user.lastName || ''}`.trim()
              : `O'quvchi ${index + 1}`;
            
            return (
              <div
                key={participant.id}
                className="flex items-center gap-3 text-white py-2 px-3 bg-black rounded-lg"
              >
                <span className="text-gray-400 font-mono">{index + 1}.</span>
                <span className="font-medium">{displayName}</span>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default ParticipantList;
