import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Lead from '../models/Lead';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types';

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: lead,
  });
});

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, source, search, sort, page = '1', limit = '10' } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (source) query.source = source;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  else if (sort === 'latest') sortOption = { createdAt: -1 };

  const total = await Lead.countDocuments(query);
  const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limitNumber).populate('createdBy', 'name email');

  res.json({
    success: true,
    data: leads,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
});

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  res.json({
    success: true,
    data: lead,
  });
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new ApiError(404, 'Lead not found');
  }

  await Lead.deleteOne({ _id: lead._id });

  res.json({
    success: true,
    data: {},
    message: 'Lead deleted successfully',
  });
});

export const exportLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status, source, search } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (source) query.source = source;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 });

  if (leads.length === 0) {
    throw new ApiError(404, 'No leads found to export');
  }

  const csvRows = [];
  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
  csvRows.push(headers.join(','));

  leads.forEach((lead) => {
    const row = [
      lead._id,
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.createdAt,
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csvString);
});
