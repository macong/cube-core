package org.cube.core.common.base.helper;

import java.util.Date;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang.StringUtils;

/**
 * 过滤条件
 * @author yangzhibin
 *
 */
public class Filtration
{
	public static final String OR = "_OR_";
	public static final String AND = "_AND_";//因为or使用比较广泛，and功能暂时没有实现

	private String[] fieldNames = null;
	private Object fieldValue = null;
	private Class<?> fieldType = null;
	private MatchType matchType = null;

	/**
	 * 构造方法(主要用于页面传值，并由WebUtils调用)
	 * @param filterName 比较属性字符串,含待比较的比较类型、属性值类型及属性列表. 如： LIKES_NAME_OR_EMAIL
	 * @param filterValue 待比较的值.
	 */
	public Filtration(String filterName, String filterValue)
	{
		String condition = StringUtils.substringBefore(filterName, "_");//条件
		String matchTypeCode = condition.substring(0, condition.length() - 1);//获取比较类型
		String fieldTypeCode = condition.substring(condition.length() - 1, condition.length());//获取值的类型

		matchType = Enum.valueOf(MatchType.class, matchTypeCode);
		fieldType = Enum.valueOf(FiledType.class, fieldTypeCode).getValue();

		String fieldNameList = StringUtils.substringAfter(filterName, "_");

		fieldNames = fieldNameList.split(Filtration.OR);
		fieldValue = ConvertUtils.convert(filterValue, fieldType);//转换字符串到相应类型.
	}

	
	/**
	 * 构造方法(主要用于自定义过滤条件)
	 * @param matchType 比较类型
	 * @param fieldValue 待比较的值.
	 * @param fieldNames 字段名称
	 */
	public Filtration(MatchType matchType, Object fieldValue, String... fieldNames)
	{
		this.matchType = matchType;
		this.fieldValue = fieldValue;
		this.fieldNames = fieldNames;
	}

	/**
	 * 是否比较多个属性.
	 */
	public boolean isMultiFilter()
	{
		return (fieldNames.length > 1);
	}

	/**
	 * 获取多个字段名称.
	 * @return
	 */
	public String[] getFieldNames()
	{
		return fieldNames;
	}

	/**
	 * 获取唯一字段名称.
	 */
	public String getFieldName()
	{
		if (fieldNames.length > 1)
		{
			throw new IllegalArgumentException("There are not only one property");
		}
		return fieldNames[0];
	}

	/**
	 * 获取比较类型
	 * @return
	 */
	public MatchType getMatchType()
	{
		return matchType;
	}

	/**
	 * 获取字段值
	 * @return
	 */
	public Object getFieldValue()
	{
		return fieldValue;
	}

	/**
	 * 比较类型
	 */
	public enum MatchType
	{
		EQ, // =
		LIKE, // like
		LT, // <
		LE, // <=
		GT, // >
		GE; // >=
	}

	/**
	 * 字段类型
	 */
	public enum FiledType
	{
		S(String.class), //字符串
		I(Integer.class), //整形
		L(Long.class), //长整形
		N(Double.class), //双精度
		D(Date.class), //时间
		B(Boolean.class);//布尔

		private Class<?> clazz;

		FiledType(Class<?> clazz)
		{
			this.clazz = clazz;
		}

		public Class<?> getValue()
		{
			return clazz;
		}
	}

}
