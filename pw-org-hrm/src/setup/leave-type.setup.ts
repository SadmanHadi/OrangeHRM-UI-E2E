import { Page } from '@playwright/test';
import { LeaveTypePage } from '../pages/LeaveTypePage';

/**
 * Project-specific setup helper to create a leave type.
 * Uses the LeaveTypePage POM.
 */
export async function createLeaveType(page: Page, name: string): Promise<void> {
  const leaveTypePage = new LeaveTypePage(page);
  await leaveTypePage.create(name);
}

/**
 * Project-specific cleanup helper to delete a leave type.
 * Uses the LeaveTypePage POM.
 */
export async function deleteLeaveType(page: Page, name: string): Promise<void> {
  const leaveTypePage = new LeaveTypePage(page);
  await leaveTypePage.delete(name);
}
