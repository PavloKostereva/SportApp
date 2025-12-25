import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  addButton: {
    padding: 8,
  },
  categoriesScroll: {
    marginBottom: 16,
    maxHeight: 50,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  exercisesList: {
    flex: 1,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  exerciseIcon: {
    marginRight: 4,
  },
  exerciseTitleContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 12,
    opacity: 0.6,
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
  },
  modalForm: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailTitleContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  detailCategoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailContent: {
    flex: 1,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailCardLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    textAlign: 'center',
  },
  detailCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailRowText: {
    flex: 1,
  },
  detailNotes: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  detailActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  workoutDaysList: {
    flex: 1,
    marginBottom: 24,
  },
  dayCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayCardCompleted: {
    opacity: 0.7,
    borderColor: '#4CAF50',
  },
  dayCardLocked: {
    opacity: 0.5,
    borderStyle: 'dashed',
  },
  dayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayNameLocked: {
    opacity: 0.6,
  },
  dayExercisesCountLocked: {
    opacity: 0.5,
    fontStyle: 'italic',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 20,
    marginBottom: 4,
  },
  dayExercisesCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  dayExercisesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dayExerciseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dayExerciseBadgeText: {
    fontSize: 12,
  },
  dayMoreExercises: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  dayModalHeader: {
    flex: 1,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dayExercisesList: {
    flex: 1,
    marginBottom: 20,
  },
  dayExerciseCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dayExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayExerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.5,
    marginTop: 8,
    textAlign: 'center',
  },
  dayModalActions: {
    marginTop: 12,
  },
  addExerciseToDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  addExerciseToDayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseSelectCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseSelectInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
  },
  removeExerciseButton: {
    padding: 8,
    marginLeft: 8,
  },
  uncompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  uncompleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exerciseActionsRow: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  replaceExerciseButton: {
    padding: 8,
    marginRight: 4,
  },
  startWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  startWorkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutModeContainer: {
    flex: 1,
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  workoutTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  workoutProgress: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  workoutProgressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutContent: {
    flex: 1,
  },
  workoutExerciseCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  workoutExerciseName: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  workoutExerciseCategory: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  workoutSetsInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutSetsLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  workoutRepsLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  workoutSetsProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  workoutSetDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    opacity: 0.3,
    marginHorizontal: 6,
  },
  completeSetButton: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  completeSetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  restTimerText: {
    fontSize: 24,
    marginBottom: 24,
  },
  restTimerValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  skipRestButton: {
    padding: 16,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  skipRestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutComplete: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  workoutCompleteText: {
    fontSize: 28,
    marginTop: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  finishWorkoutButton: {
    padding: 18,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  finishWorkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  startTimerLabel: {
    fontSize: 32,
    marginBottom: 40,
    opacity: 0.7,
  },
  startTimerValue: {
    fontSize: 120,
    fontWeight: 'bold',
  },
  restTimerBar: {
    padding: 16,
    borderBottomWidth: 2,
  },
  restTimerBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restTimerBarText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  skipRestBarButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skipRestBarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
