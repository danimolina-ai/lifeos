// Work Service - Projects and Tasks
import { supabase } from '../lib/supabase'

export const workService = {
    // ========== PROJECTS ==========

    // Get all projects
    async getProjects(userId) {
        const { data, error } = await supabase
            .from('user_work_projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        return { data, error }
    },

    // Create project
    async createProject(userId, projectData) {
        const { data, error } = await supabase
            .from('user_work_projects')
            .insert({
                user_id: userId,
                ...projectData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update project
    async updateProject(projectId, updates) {
        const { data, error } = await supabase
            .from('user_work_projects')
            .update(updates)
            .eq('id', projectId)
            .select()
            .single()

        return { data, error }
    },

    // Delete project
    async deleteProject(projectId) {
        const { error } = await supabase
            .from('user_work_projects')
            .delete()
            .eq('id', projectId)

        return { error }
    },

    // ========== TASKS ==========

    // Get all tasks
    async getTasks(userId) {
        const { data, error } = await supabase
            .from('user_work_tasks')
            .select('*, project:user_work_projects(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        return { data, error }
    },

    // Get tasks by project
    async getTasksByProject(userId, projectId) {
        const { data, error } = await supabase
            .from('user_work_tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('project_id', projectId)
            .order('created_at')

        return { data, error }
    },

    // Get tasks by Eisenhower quadrant
    async getTasksByQuadrant(userId, quadrant) {
        const { data, error } = await supabase
            .from('user_work_tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('eisenhower', quadrant)
            .eq('completed', false)
            .order('created_at')

        return { data, error }
    },

    // Create task
    async createTask(userId, taskData) {
        const { data, error } = await supabase
            .from('user_work_tasks')
            .insert({
                user_id: userId,
                ...taskData
            })
            .select()
            .single()

        return { data, error }
    },

    // Update task
    async updateTask(taskId, updates) {
        const { data, error } = await supabase
            .from('user_work_tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single()

        return { data, error }
    },

    // Delete task
    async deleteTask(taskId) {
        const { error } = await supabase
            .from('user_work_tasks')
            .delete()
            .eq('id', taskId)

        return { error }
    },

    // Toggle task completion
    async toggleTask(taskId, completed) {
        return this.updateTask(taskId, {
            completed,
            completed_at: completed ? new Date().toISOString() : null
        })
    }
}
